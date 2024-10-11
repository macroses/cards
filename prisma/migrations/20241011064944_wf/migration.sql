-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT,
    "answer" TEXT,
    "title" TEXT,
    "tags" TEXT,
    "partOfSpeech" TEXT,
    "exampleSentence" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moduleId" TEXT NOT NULL,
    CONSTRAINT "Card_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("answer", "createdAt", "exampleSentence", "id", "moduleId", "partOfSpeech", "question", "tags", "title") SELECT "answer", "createdAt", "exampleSentence", "id", "moduleId", "partOfSpeech", "question", "tags", "title" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
