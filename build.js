import { copy } from 'esbuild-plugin-copy';
import * as esbuild from "esbuild";

const watch = process.argv && process.argv.indexOf('--watch') > -1;

esbuild.build({
    entryPoints: ['src/background.ts', 'src/content.tsx', 'src/popup.tsx', 'src/settings.tsx'],
    bundle: true,
    outdir: "dist",
    watch: watch,
    loader: { '.js': 'jsx'},
    plugins: [
        copy({
            assets: {
                from: ['./public/*', './public/images/*', 'manifest.json'],
                to: ['./dist'],
            }
        })
    ]
}).catch(() => process.exit(1));
