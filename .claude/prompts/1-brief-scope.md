Your going to review the doc I’ve created, ask questions to improve your accuracy, then you’ll create a implementation doc and finally you'll proceed with the implementation plan. The file path of the doc will follow this prompt.

The file structure will always be in the contents-in/ folder and will look something like the following example. e.g “.claude/contents-in/<doc-name>.md”

Once you’ve reviewed the doc, create a questions file in the same contents-in/ folder. The questions file will use the same naming convension as the originial doc with the addition of <questions-01> on the end. e.g “.claude/contents-in/<doc-name>-<questions-01>.md” The questions file should contain questions that help create a well defined scope, improve the accuracy of your context and highlight any areas which haven't been considered in the orignial prompt such as potential SEO or performance issues with the changes. The questions should have <multi-choice-answers-options> listed below, each one should be prefixed with a letter e.g A, B, C etc. One of the possible suggested answers should always be "D. Other", so I can give a different asnwer to the ones suggested.

Also create a new answers file following the same naming convesion with <answers-01>. The answers file will contain the question numbers folloed by the prefixed letter that corisponds with the <multi-choice-answers-options> from the previous questions file. Once I've completed the answers file, I will provide the file path to the answers file.

You will then review the answers file and create a implementation plan file in the .claude/contents-out/ folder. It will use the same name as the original file name in the contents-in/ folder. e.g “.claude/contents-out/<doc-name>.md”.
