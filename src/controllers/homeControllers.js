exports.home = ((req, res)=>{
   res.render('index');
});

exports.pdftoimg = ((req, res) => {
   res.send("Converte pdf em img");

   pdf.info(file)
       .then(pdfinfo => {
           console.log(pdfinfo);
       });

   let opts = {
       format: 'png',
       out_dir: path.dirname(file),
       out_prefix: path.basename(file, path.extname(file)),
       page: null,
       resolution: 500
   }

   pdf.convert(file, opts)
       .then(res => {
           console.log('Successfully converted');
       })
       .catch(error => {
           console.error(error);
       })

});