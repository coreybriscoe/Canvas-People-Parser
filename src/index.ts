// load a file from the file system
import { readFileSync } from 'fs';
import { resolve } from 'path';

// read from ../in/file.txt
const contents = readFileSync(resolve(__dirname, '../in/file.txt'), 'utf8');
// console.log(contents);

// extract the each instance of text in an a tag with the class "roster_user_name student_context_card_trigger" with arbitrary properties before or after the class attribute



const regex = /<a [^>]*class="roster_user_name student_context_card_trigger" [^>]*>([^<]*)<\/a>/g;
// list patterns that match the above:


// regex to match any character (including newline) except the exact sequence </a>


const match = regex.exec(contents);
console.log(match);

// how to accept zero to many characters in a regex?
