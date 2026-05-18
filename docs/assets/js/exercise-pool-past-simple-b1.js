/**
 * Past Simple — B1 level pool (CEFR B1).
 */
window.PAST_SIMPLE_POOL_B1 = {
  level: "b1",
  label: "B1",
  writing: {
    id: "ex6",
    title: "6. A day in the past",
    hint: "Write 5–6 sentences (~30 words). Use past simple.",
    sampleAnswer:
      "Yesterday I woke up at seven. I had breakfast and walked to school. I didn't watch TV in the morning. My friend called me after lunch. We played football in the park.",
    points: 5
  },
  sections: [
    {
      id: "ex1",
      title: "Exercise 1: Write the past form",
      instructions: "Write the past form of the verb (-ed or irregular).",
      items: [
        { html: "<strong>1.</strong> play → {{input}}", inputType: "short", answers: ["played"] },
        { html: "<strong>2.</strong> visit → {{input}}", inputType: "short", answers: ["visited"] },
        { html: "<strong>3.</strong> study → {{input}}", inputType: "short", answers: ["studied"] },
        { html: "<strong>4.</strong> stop → {{input}}", inputType: "short", answers: ["stopped"] },
        { html: "<strong>5.</strong> try → {{input}}", inputType: "short", answers: ["tried"] },
        { html: "<strong>6.</strong> go → {{input}}", inputType: "short", answers: ["went"] },
        { html: "<strong>7.</strong> see → {{input}}", inputType: "short", answers: ["saw"] },
        { html: "<strong>8.</strong> buy → {{input}}", inputType: "short", answers: ["bought"] },
        { html: "<strong>9.</strong> have → {{input}}", inputType: "short", answers: ["had"] },
        { html: "<strong>10.</strong> do → {{input}}", inputType: "short", answers: ["did"] }
      ]
    },
    {
      id: "ex2",
      title: "Exercise 2: Complete the affirmative sentences",
      instructions: "Use the past form of the verb in brackets.",
      items: [
        { html: "<strong>1.</strong> I (walk) {{input}} to school yesterday.", inputType: "short", answers: ["walked"] },
        { html: "<strong>2.</strong> She (watch) {{input}} a film last night.", inputType: "short", answers: ["watched"] },
        { html: "<strong>3.</strong> They (play) {{input}} football after school.", inputType: "short", answers: ["played"] },
        { html: "<strong>4.</strong> He (visit) {{input}} his grandma on Sunday.", inputType: "short", answers: ["visited"] },
        { html: "<strong>5.</strong> We (eat) {{input}} pizza for dinner.", inputType: "short", answers: ["ate"] },
        { html: "<strong>6.</strong> It (rain) {{input}} yesterday afternoon.", inputType: "short", answers: ["rained"] },
        { html: "<strong>7.</strong> You (finish) {{input}} your homework.", inputType: "short", answers: ["finished"] },
        { html: "<strong>8.</strong> My dad (cook) {{input}} dinner.", inputType: "short", answers: ["cooked"] },
        { html: "<strong>9.</strong> I (go) {{input}} to the shop.", inputType: "short", answers: ["went"] },
        { html: "<strong>10.</strong> The train (arrive) {{input}} on time.", inputType: "short", answers: ["arrived"] }
      ]
    },
    {
      id: "ex3",
      title: "Exercise 3: Make negative sentences",
      instructions: "Use didn't + base verb.",
      items: [
        { html: "<strong>1.</strong> I walked to school.<br>→ I {{input}} to school.", inputType: "phrase", answers: ["didn't walk", "did not walk"] },
        { html: "<strong>2.</strong> She watched a film.<br>→ She {{input}} a film.", inputType: "phrase", answers: ["didn't watch", "did not watch"] },
        { html: "<strong>3.</strong> They played football.<br>→ They {{input}} football.", inputType: "phrase", answers: ["didn't play", "did not play"] },
        { html: "<strong>4.</strong> He visited his grandma.<br>→ He {{input}} his grandma.", inputType: "phrase", answers: ["didn't visit", "did not visit"] },
        { html: "<strong>5.</strong> We ate pizza.<br>→ We {{input}} pizza.", inputType: "phrase", answers: ["didn't eat", "did not eat"] },
        { html: "<strong>6.</strong> It rained yesterday.<br>→ It {{input}} yesterday.", inputType: "phrase", answers: ["didn't rain", "did not rain"] },
        { html: "<strong>7.</strong> You finished your homework.<br>→ You {{input}} your homework.", inputType: "phrase", answers: ["didn't finish", "did not finish"] },
        { html: "<strong>8.</strong> I went to the shop.<br>→ I {{input}} to the shop.", inputType: "phrase", answers: ["didn't go", "did not go"] },
        { html: "<strong>9.</strong> The dog barked.<br>→ The dog {{input}} .", inputType: "phrase", answers: ["didn't bark", "did not bark"] },
        { html: "<strong>10.</strong> They studied English.<br>→ They {{input}} English.", inputType: "phrase", answers: ["didn't study", "did not study"] }
      ]
    },
    {
      id: "ex4",
      title: "Exercise 4: Make questions",
      instructions: "Use Did + subject + base verb.",
      items: [
        { html: "<strong>1.</strong> You walked to school.<br>→ {{input}} to school?", inputType: "phrase", answers: ["did you walk"] },
        { html: "<strong>2.</strong> She watched a film.<br>→ {{input}} a film?", inputType: "phrase", answers: ["did she watch"] },
        { html: "<strong>3.</strong> They played football.<br>→ {{input}} football?", inputType: "phrase", answers: ["did they play"] },
        { html: "<strong>4.</strong> He visited his grandma.<br>→ {{input}} his grandma?", inputType: "phrase", answers: ["did he visit"] },
        { html: "<strong>5.</strong> We ate pizza.<br>→ {{input}} pizza?", inputType: "phrase", answers: ["did we eat"] },
        { html: "<strong>6.</strong> It rained yesterday.<br>→ {{input}} yesterday?", inputType: "phrase", answers: ["did it rain"] },
        { html: "<strong>7.</strong> You finished your homework.<br>→ {{input}} your homework?", inputType: "phrase", answers: ["did you finish"] },
        { html: "<strong>8.</strong> I went to the shop.<br>→ {{input}} to the shop?", inputType: "phrase", answers: ["did i go", "did I go"] },
        { html: "<strong>9.</strong> The children played outside.<br>→ {{input}} outside?", inputType: "phrase", answers: ["did the children play"] },
        { html: "<strong>10.</strong> She cooked dinner.<br>→ {{input}} dinner?", inputType: "phrase", answers: ["did she cook"] }
      ]
    },
    {
      id: "ex5",
      title: "Exercise 5: Transform the affirmative sentence",
      instructions: "Boxes 1–2: negative. Boxes 3–4: question.",
      printType: "transform-grid",
      teacherPrintOnly: true,
      printCount: 4,
      items: [
        {
          affirmative: "She visited London last year.",
          instruction: "Make it negative.",
          transformType: "negative",
          answer: "She didn't visit London last year."
        },
        {
          affirmative: "They played tennis on Saturday.",
          instruction: "Make it negative.",
          transformType: "negative",
          answer: "They didn't play tennis on Saturday."
        },
        {
          affirmative: "He finished his homework.",
          instruction: "Transform to question.",
          transformType: "question",
          answer: "Did he finish his homework?"
        },
        {
          affirmative: "We watched a film.",
          instruction: "Transform to the question.",
          transformType: "question",
          answer: "Did we watch a film?"
        },
        {
          affirmative: "I walked to work yesterday.",
          instruction: "Make it negative.",
          transformType: "negative",
          answer: "I didn't walk to work yesterday."
        },
        {
          affirmative: "The bus arrived late.",
          instruction: "Make it negative.",
          transformType: "negative",
          answer: "The bus didn't arrive late."
        },
        {
          affirmative: "You studied for the test.",
          instruction: "Transform to question.",
          transformType: "question",
          answer: "Did you study for the test?"
        },
        {
          affirmative: "It rained in the morning.",
          instruction: "Transform to question.",
          transformType: "question",
          answer: "Did it rain in the morning?"
        }
      ]
    }
  ]
};
