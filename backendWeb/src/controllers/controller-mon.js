const config = require('../configs/database');
const mysql = require('mysql');
const pool = mysql.createPool(config);

require('dotenv').config();
const knownApiKey = process.env.API_KEY;

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    getData(req, res){
        const apiKey = req.headers['x-api-key'];
        
        if (apiKey === knownApiKey) {
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query('SELECT * FROM monitoring_data WHERE Tanggal = (SELECT DISTINCT Tanggal FROM monitoring_data ORDER BY Tanggal DESC LIMIT 1)',
                function (error, results) {
                    if(error) throw error;  
                    res.json(results);
                });
                connection.release();
            })
        } else {
            res.status(401).json({ error: 'Invalid API key' });
        }
    },
    getDataByDate(req, res){
        const apiKey = req.headers['x-api-key'];
        
        if (apiKey === knownApiKey) {
            const { date } = req.params;
            console.log(date);
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query('SELECT * FROM monitoring_data WHERE Tanggal = ?', [date],
                function (error, results) {
                    if(error) throw error;  
                    res.json(results);
                });
                connection.release();
            })
        } else {
            res.status(401).json({ error: 'Invalid API key' });
        }
    },
    getDataByMonth(req, res){
        const apiKey = req.headers['x-api-key'];
        
        if (apiKey === knownApiKey) {
            const { month } = req.params;
            console.log(month);
            const sql = `SELECT CONCAT(LPAD(AVG(DATE_FORMAT(CONCAT(Tanggal, \' \', Waktu), \'%H:00:00\')), 2, \'0\'), \':00:00\') AS Waktu, 
            AVG(Suhu1) AS Suhu1, AVG(Suhu2) AS Suhu2, AVG(Suhu3) AS Suhu3, AVG(Suhu4) AS Suhu4, AVG(Suhu_Mean) AS Suhu_Mean,
            AVG(RH1) AS RH1, AVG(RH2) AS RH2, AVG(RH3) AS RH3, AVG(RH4) AS RH4, AVG(RH_Mean) AS RH_Mean,
            AVG(SH1) AS SH1, AVG(SH2) AS SH2, AVG(SH3) AS SH3, AVG(SH4) AS SH4, AVG(SH_Mean) AS SH_Mean,
            AVG(IC1) AS IC1, AVG(IC2) AS IC2, AVG(IC3) AS IC3, AVG(IC4) AS IC4, AVG(IC_Mean) AS IC_Mean         
            FROM monitoring_data WHERE Tanggal LIKE ?
            GROUP BY HOUR(CONCAT(Tanggal, \' \', Waktu)) ORDER BY Waktu;`;
                
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(sql, [`${month}%`],
                function (error, results) {
                    if(error) throw error;  
                    res.json(results);
                });
                connection.release();
            })
        } else {
            res.status(401).json({ error: 'Invalid API key' });
        }
    },
    getAvailableDates(req, res){
        const apiKey = req.headers['x-api-key'];
        
        if (apiKey === knownApiKey) {
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query('SELECT DISTINCT Tanggal FROM monitoring_data ORDER BY Tanggal DESC;',
                function (error, results) {
                    if(error) throw error;  
                    res.json(results);
                });
                connection.release();
            })
        } else {
            res.status(401).json({ error: 'Invalid API key' });
        }
    },
    downloadDataByDate(req, res){
        const apiKey = req.headers['x-api-key'];
        
        if (apiKey === knownApiKey) {
            const { date } = req.params;
            console.log(date);
            pool.getConnection(function (err, connection) {
                if (err) {
                console.error(err); // Log the error
                res.status(500).send('Internal Server Error'); // Send an appropriate error response
                return; // Return to prevent further execution
                }
            
                connection.query(
                'SELECT * FROM monitoring_data WHERE Tanggal = ?',
                [date],
                function (error, results) {
                    if (error) {
                    console.error(error); // Log the error
                    res.status(500).send('Internal Server Error'); // Send an appropriate error response
                    connection.release(); // Release the connection
                    return; // Return to prevent further execution
                    }
            
                    if (!results || results.length === 0) {
                    console.error('No results found.'); // Log the error
                    res.status(404).send('No data found.'); // Send an appropriate error response
                    connection.release(); // Release the connection
                    return; // Return to prevent further execution
                    }
            
                    let csv = `${Object.keys(results[0]).join(',')}\n`;
                    results.forEach((row) => {
                    csv += `${Object.values(row).join(',')}\n`;
                    });
            
                    const csvData = csv;
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', `attachment; filename=Data-${date}.csv`);
                    res.send(csv);
                    connection.release();
                }
                );
            });
        } else {
            res.status(401).json({ error: 'Invalid API key' });
        }
    },
    getNodes(req, res){
        const apiKey = req.headers['x-api-key'];
        
        if (apiKey === knownApiKey) {
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query('SELECT * FROM nodes',
                function (error, results) {
                    if(error) throw error;  
                    res.json(results);
                });
                connection.release();
            })
        } else {
            res.status(401).json({ error: 'Invalid API key' });
        }
    },
}