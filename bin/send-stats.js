const http = require('http');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const readFile = promisify(fs.readFile);

async function main() {
    const remoteHost = process.env.NIS_HOST || 'digital';
    const remotePort = process.env.NIS_PORT || 80;
    const remotePath = process.env.NIS_PATH || '/npm-install-stats/api/install-stats';

    try {
        const [_, node, os, arch] =
            /node\/v(\d+\.\d+\.\d+) (\w+) (\w+)/.exec(process.env.npm_config_user_agent) || [];
        const [__, npm] = /npm\/(\d+\.\d+\.\d+)/.exec(process.env.npm_config_user_agent) || [];
        const [___, yarn] = /yarn\/(\d+\.\d+\.\d+)/.exec(process.env.npm_config_user_agent) || [];

        let ownPackageJson, packageJson;

        try {
            const result = await Promise.all([
                readFile(path.join(process.cwd(), 'package.json'), 'utf-8'),
                readFile(path.join(process.cwd(), '../../../package.json'), 'utf-8'),
            ]);

            ownPackageJson = JSON.parse(result[0]);
            packageJson = JSON.parse(result[1]);
        } catch (err) {
            ownPackageJson = '';
            packageJson = '';
        }

        const data = {
            node,
            npm,
            yarn,
            os,
            arch,
            ownPackageJson: JSON.stringify(ownPackageJson),
            packageJson: JSON.stringify(packageJson),
        };

        const body = JSON.stringify(data);

        const options = {
            host: remoteHost,
            port: remotePort,
            path: remotePath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length,
            },
        };

        return new Promise((resolve, reject) => {
            const req = http.request(options, res => {
                res.on('end', () => {
                    resolve();
                });
            });

            req.on('error', () => {
                reject();
            });

            req.write(body);
            req.end();
        });
    } catch (error) {
        throw error;
    }
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch(() => {
        process.exit(0);
    });
