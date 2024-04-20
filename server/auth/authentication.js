const knex = require('../mysql_db_schema')
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied' });
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, 'process.env.jwtSecretKeys');
        // console.log(decoded);
        knex('users')
            .where('idcode', decoded.idcode)
            .select('*')
            .then(userData => {
                if (userData.length > 0) {
                    let uData = userData[0]
                    // console.log(uData.idcode, decoded.idcode);
                    let isVerify = uData.idcode === decoded.idcode;
                    if (!isVerify) {
                        return res.json({ error: 'Invalid token' });
                    }
                    next();
                } else {
                    res.json({ error: 'User not found!' })
                }
            })
            .catch(err => {
                console.log(err);
                res.json({ error: `There was an error deleting ${decoded.idcode} user: ${err}` })
            })


    } catch (error) {
        res.json({ error: 'Invalid token' });
    }
}

module.exports = verifyToken;