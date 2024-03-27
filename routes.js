const express = require('express');
const route = express.Router();
const homeControllers = require('./src/controllers/homeControllers');

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-poppler');
const Tesseract = require('tesseract.js');
const pdfparse = require('pdf-parse');
const { PDFDocument, utf8Encode, rgb } = require('pdf-lib');
const { PDFDocumentFactory, PDFDocumentWriter, drawText } = require('pdf-lib');
const { send } = require('process');
const Buffer = require('buffer/').Buffer;
const { merge } = require('merge-pdf-buffers');


const file = "C:/Users/DarcyJr/Documents/1 - Programacao/EXERCICIO/pdftoimg/COMPROVANTES LGMG.pdf"
const fileArq = "C:/Users/DarcyJr/Documents/1 - Programacao/EXERCICIO/pdftoimg/arquivo.txt"
//const file = "C:/Users/DarcyJr/Documents/1 - Programacao/EXERCICIO/pdftoimg/Laudo_154402008_23100615529.pdf"
//const fileimg = "C:/Users/DarcyJr/Documents/1 - Programacao/EXERCICIO/pdftoimg/BSEV_ANA CRISTINA DE ABREU_2106_0910-1.png"
const fileimg = "C:/Users/DarcyJr/Documents/1 - Programacao/EXERCICIO/pdftoimg/COMPROVANTES LGMG-02.png"

route.get('/', homeControllers.home);//pagina inicial

route.get('/pdftoimg',(req, res)=>{
    res.send('Olá');
});

route.get('/imgtotxt', (req, res) => {
    res.send("Converte img em txt");
    Tesseract.recognize(fileimg, 'por',
        { logger: info => console.log(info) })
        .then(({ data: { text } }) => {
            console.log(text)
        }).catch(error => {
            console.error(error)
        })
})

route.get('/pdftotxt', (req, res) => {
    res.send("Converte pdf em txt");
    fs.readFile(file, (err, data) => {
        pdfparse(data).then(function (data) {
            console.log(data);
        });
    });
})

route.get('/editpdf', async (req, res) => {
    res.send("Edita pdf");

    // Carregar o arquivo PDF existente
    const doc = fs.readFileSync(file, 'utf8')
    //console.log(doc)

    // Escrever no arquivo
    fs.writeFile(fileArq, doc, (err) => {
        if (err) {
            console.error('Erro ao criar o arquivo:', err);
        } else {
            console.log('Arquivo criado com sucesso!');
        }
    });
})

route.get('/parsepdf', async (req, res) => {
    res.send("Parse pdf");
    const extrair = async (caminho) => {
        const dataBuffer = fs.readFileSync(caminho);

        try {
            const data = await pdfparse(dataBuffer);
            return data.text;
        } catch (error) {
            console.error("Erro ao extrair texto do PDF:", error);
            return null;
        }
    }

    extrair(file)
        .then((data) => {
            console.log(data);
        })
        .catch((erro) => {
            console.log('Error geral:', erro);
        })
})

route.get('/pdflib', (req, res) => {
    res.send("pdflib");
    const extrairTextoPDF = async (caminho) => {
        try {
            // Verifica se o PDF está protegido por senha
            const isSenhaNecessaria = await pdfparse(fs.readFileSync(caminho), { max: 1 }).then(data => data.info['Info'] !== undefined);
            console.log(isSenhaNecessaria)
            /*if (isSenhaNecessaria) {
                // Tenta abrir o PDF com a senha fornecida
                const doc = await PDFDocumentFactory.load(fs.readFileSync(caminho), { ignoreEncryption: false, password: senha });
                const textoExtraido = await pdfParse(await PDFDocumentWriter.saveToBytes(doc));
                return textoExtraido.text;
            } else {*/
            // Se não há senha, extrai o texto diretamente
            const textoExtraido = await pdfparse(fs.readFileSync(caminho));
            return textoExtraido;
            /*}*/
        } catch (error) {
            console.error('Erro ao extrair texto do PDF:', error);
            return null;
        }
    };

    extrairTextoPDF(file)
        .then((textoExtraido) => {
            console.log(textoExtraido);
        })
        .catch((erro) => {
            console.error('Erro geral:', erro);
        });

});

route.get('/buffer', async (req, res) => {
    try {
        const data = fs.readFileSync(file, 'utf-8');
        //res.send(data)
        const { merged } = await merge(data)
        res.send(merged)

    } catch (error) { }
})

module.exports = route;