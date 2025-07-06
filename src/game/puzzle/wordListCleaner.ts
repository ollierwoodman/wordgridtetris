import fs from "fs";
import path from "path";

const IN_FILE_NAME = "checked.json";
const OUT_FILE_NAME = "checked.json";

interface WordList {
  theme: string;
  words: string[];
}

function filterWordLists(): void {
  const inputPath = path.join(
    process.cwd(),
    "public",
    "solutions",
    "word",
    IN_FILE_NAME
  );
  const outputPath = path.join(
    process.cwd(),
    "public",
    "solutions",
    "word",
    OUT_FILE_NAME
  );

  try {
    // Read the unchecked.json file
    const data = fs.readFileSync(inputPath, "utf8");
    const wordLists: WordList[] = JSON.parse(data);

    console.log(`Read ${wordLists.length} word lists from unchecked.json`);

    // Filter for word lists with exactly 5 words, each with exactly 5 letters
    const filteredWordLists = wordLists.filter((wordList) => {
      return (
        wordList.words.length === 5 &&
        wordList.words.every((word) => word.length === 5)
      );
    });

    console.log(
      `Found ${filteredWordLists.length} word lists that meet the criteria`
    );

    // Count unique words across all filtered word lists
    const allWords = filteredWordLists.flatMap(wordList => wordList.words);
    const uniqueWords = new Set(allWords);
    
    console.log(`Total unique words used across all filtered word lists: ${uniqueWords.size}`);

    // Remove themes that have 3 or more words in common with other themes
    const deduplicatedWordLists = [];
    const processedIndices = new Set<number>();

    for (let i = 0; i < filteredWordLists.length; i++) {
      if (processedIndices.has(i)) continue;

      const currentWordList = filteredWordLists[i];
      let isDuplicate = false;

      // Check against all previous themes in deduplicatedWordLists
      for (const existingWordList of deduplicatedWordLists) {
        const commonWords = currentWordList.words.filter(word => 
          existingWordList.words.includes(word)
        );
        
        if (commonWords.length >= 3) {
          console.log(`Removing duplicate theme "${currentWordList.theme}" (${commonWords.length} words in common with "${existingWordList.theme}": ${commonWords.join(', ')})`);
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        deduplicatedWordLists.push(currentWordList);
      }
      processedIndices.add(i);
    }

    console.log(`After removing duplicates: ${deduplicatedWordLists.length} word lists remaining`);

    // Convert themes to lowercase before writing
    const filteredWordListsWithLowercase = deduplicatedWordLists.map(wordList => ({
      ...wordList,
      theme: wordList.theme.toLowerCase()
    }));

    // Write the filtered results to checked.json
    fs.writeFileSync(outputPath, JSON.stringify(filteredWordListsWithLowercase, null, 2));

    console.log(
      `Successfully wrote ${filteredWordLists.length} word lists to checked.json`
    );
  } catch (error) {
    console.error("Error processing word lists:", error);
  }
}

function main() {
  filterWordLists();
}
main();

export { filterWordLists };
