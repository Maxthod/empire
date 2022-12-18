import fs from 'fs';
import readline from 'readline';

export type generator_fn<T> = (entry: { [key in keyof T]: string }) => T
export const streamCsvLineByLine = async function*<T>(csv_path: string, generator: generator_fn<T>) {
    const fileStream = fs.createReadStream(csv_path);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let headers: Array<string> | undefined = undefined
    for await (const line of rl) {
        const parts = line.split(",")
        if (!headers) {
            headers = parts
        } else {
            const entry: { [key: string]: string } = {}
            headers.forEach((header, index) => {
                entry[header] = parts[index]
            })
            yield generator(entry as { [key in keyof T]: string })
        }
    }
}