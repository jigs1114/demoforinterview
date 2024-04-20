const knex = require('../mysql_db_schema')
const path = require('path')
const fs = require('fs');

exports.imageupload = async (req, res) => {
    let samplefile
    let idcode
    samplefile = req.files.file
    console.log(samplefile);
    isarray = Array.isArray(samplefile)
    idcode = req.body.idcode
    filenames = []
    uploadPath = `assets/`;

    await fs.access(uploadPath, async function (error) {
        console.log('isarray', isarray);
        if (isarray === true) {
            for (let i = 0; i < samplefile.length; i++) {
                console.log(1);
                var datafiles = samplefile[i]
                var fileExt = path.extname(datafiles.name)
                var newName = `${Math.round(Math.random() * 1E9)}${fileExt}`
                filenames.push(newName)

                fileuploadPath = uploadPath + newName;
                datafiles.mv(fileuploadPath, function (err) {
                    if (err) {
                        return res.json({ error: err })
                    }
                });
                return res.json({ data: filenames })
            }
        } else {
            var fileExt = path.extname(samplefile.name)
            var newName = `${Math.round(Math.random() * 1E9)}${fileExt}`
            fileuploadPath = uploadPath + newName;
            samplefile.mv(fileuploadPath, function (err) {
                if (err) {
                    return res.json({ error: err })
                } else {
                    console.log('successfully uploaded');
                    knex('messages')
                        .insert({
                            'idcode': Date.now(),
                            'senderid': req.body.senderid,
                            'receiverid': req.body.receiverid,
                            'message': req.body.message,
                            'room': req.body.room,
                            'time': req.body.time,
                            'attachfile': newName
                        })
                        .then(() => {
                            res.json({ data: `messages created by ${req.body.room} .` })
                        })
                        .catch(err => {
                            res.json({ error: `There was an error creating ${req.body.user_idcode} messages: ${err}` })
                        })
                }
            });

        }

    })

}


exports.deleteImgFile = async (req, res) => {
    filename = req.body.filename
    idcode = req.body.idcode

    knex('settings').where(
        'idcode', 'like', `%${idcode}%`
    ).select('*')
        .then(productnamedata => {
            existingfilesname = JSON.parse(productnamedata[0].aboutPage_img)
            index = existingfilesname.indexOf(filename);
            console.log('indexxxxxxxxxxx', index);
            if (index > -1) {
                existingfilesname.splice(index, 1);
            }
            knex('settings')
                .where('idcode', idcode)
                .update({
                    'aboutPage_img': JSON.stringify(existingfilesname)
                })
                .then(() => {
                    console.log({ message: `settings \'${idcode}\' by ${idcode} updated.` })
                    fs.unlinkSync(`assets/${filename}`), function (err) {
                        if (err) {
                            console.log(err);
                        }
                    }
                    console.log('file deleted');
                    return res.json({ data: 'File Deleted' })
                })
                .catch(err => {
                    return res.json({ message: `update query:There was an error updating ${idcode} Settins: ${err}` })
                })
        })
        .catch(err => {
            return res.json({ message: `getDataQuery : There was an error creating ${idcode} Settins: ${err}` })
        })
}



