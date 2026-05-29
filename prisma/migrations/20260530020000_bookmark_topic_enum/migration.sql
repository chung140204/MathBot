-- Constrain study_bookmarks.topic to the Topic enum (was free-text).
-- All existing values are valid enum keys, so the cast is safe.
ALTER TABLE "study_bookmarks" ALTER COLUMN "topic" TYPE "Topic" USING "topic"::"Topic";
