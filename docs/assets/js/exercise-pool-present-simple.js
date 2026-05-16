/**
 * Present Simple exercise pool — 10 items per section (2× the original 5).
 * Used by exercise-engine.js to build worksheets.
 */
window.PRESENT_SIMPLE_POOL = {
  sections: [
    {
      id: "ex1",
      title: "Exercise 1: Add -s/-es/-ies to the verb",
      instructions: 'Write the correct form of the verb for "he/she/it".',
      items: [
        { html: "<strong>1.</strong> She (play) {{input}} tennis every Saturday.", inputType: "short", answers: ["plays"] },
        { html: "<strong>2.</strong> He (watch) {{input}} TV in the evening.", inputType: "short", answers: ["watches"] },
        { html: "<strong>3.</strong> My brother (study) {{input}} English at university.", inputType: "short", answers: ["studies"] },
        { html: "<strong>4.</strong> The train (go) {{input}} to London every morning.", inputType: "short", answers: ["goes"] },
        { html: "<strong>5.</strong> She (do) {{input}} her homework after school.", inputType: "short", answers: ["does"] },
        { html: "<strong>6.</strong> Tom (run) {{input}} in the park every morning.", inputType: "short", answers: ["runs"] },
        { html: "<strong>7.</strong> The baby (cry) {{input}} at night sometimes.", inputType: "short", answers: ["cries"] },
        { html: "<strong>8.</strong> My sister (teach) {{input}} maths at school.", inputType: "short", answers: ["teaches"] },
        { html: "<strong>9.</strong> It (rain) {{input}} a lot in autumn.", inputType: "short", answers: ["rains"] },
        { html: "<strong>10.</strong> He (fix) {{input}} bikes at the weekend.", inputType: "short", answers: ["fixes"] }
      ]
    },
    {
      id: "ex2",
      title: "Exercise 2: Complete the affirmative sentences",
      instructions: "Use the correct form of the verb in brackets.",
      items: [
        { html: "<strong>1.</strong> I (like) {{input}} chocolate ice cream.", inputType: "short", answers: ["like"] },
        { html: "<strong>2.</strong> My friends (live) {{input}} in a big city.", inputType: "short", answers: ["live"] },
        { html: "<strong>3.</strong> The shop (open) {{input}} at 9 o'clock.", inputType: "short", answers: ["opens"] },
        { html: "<strong>4.</strong> We (speak) {{input}} English in class.", inputType: "short", answers: ["speak"] },
        { html: "<strong>5.</strong> My cat (sleep) {{input}} on the sofa every day.", inputType: "short", answers: ["sleeps"] },
        { html: "<strong>6.</strong> They (enjoy) {{input}} cooking together.", inputType: "short", answers: ["enjoy"] },
        { html: "<strong>7.</strong> Birds (fly) {{input}} south in winter.", inputType: "short", answers: ["fly"] },
        { html: "<strong>8.</strong> She (want) {{input}} a new phone.", inputType: "short", answers: ["wants"] },
        { html: "<strong>9.</strong> I (need) {{input}} more time.", inputType: "short", answers: ["need"] },
        { html: "<strong>10.</strong> We (walk) {{input}} to school every day.", inputType: "short", answers: ["walk"] }
      ]
    },
    {
      id: "ex3",
      title: "Exercise 3: Make negative sentences",
      instructions: 'Use "do not" or "does not" + base verb.',
      items: [
        { html: "<strong>1.</strong> I (like) spicy food.<br>→ I {{input}} spicy food.", inputType: "phrase", answers: ["do not like", "don't like"] },
        { html: "<strong>2.</strong> She (play) basketball.<br>→ She {{input}} basketball.", inputType: "phrase", answers: ["does not play", "doesn't play"] },
        { html: "<strong>3.</strong> They (work) on Sundays.<br>→ They {{input}} on Sundays.", inputType: "phrase", answers: ["do not work", "don't work"] },
        { html: "<strong>4.</strong> He (drink) coffee.<br>→ He {{input}} coffee.", inputType: "phrase", answers: ["does not drink", "doesn't drink"] },
        { html: "<strong>5.</strong> My parents (watch) TV in the morning.<br>→ My parents {{input}} TV in the morning.", inputType: "phrase", answers: ["do not watch", "don't watch"] },
        { html: "<strong>6.</strong> We (eat) meat.<br>→ We {{input}} meat.", inputType: "phrase", answers: ["do not eat", "don't eat"] },
        { html: "<strong>7.</strong> She (know) the answer.<br>→ She {{input}} the answer.", inputType: "phrase", answers: ["does not know", "doesn't know"] },
        { html: "<strong>8.</strong> They (travel) by bus.<br>→ They {{input}} by bus.", inputType: "phrase", answers: ["do not travel", "don't travel"] },
        { html: "<strong>9.</strong> He (like) spiders.<br>→ He {{input}} spiders.", inputType: "phrase", answers: ["does not like", "doesn't like"] },
        { html: "<strong>10.</strong> I (understand) this rule.<br>→ I {{input}} this rule.", inputType: "phrase", answers: ["do not understand", "don't understand"] }
      ]
    },
    {
      id: "ex4",
      title: "Exercise 4: Make questions",
      instructions: 'Use "Do" or "Does" + subject + base verb.',
      items: [
        { html: "<strong>1.</strong> You speak French.<br>→ {{input}} French?", inputType: "phrase", answers: ["do you speak"] },
        { html: "<strong>2.</strong> She likes pizza.<br>→ {{input}} pizza?", inputType: "phrase", answers: ["does she like"] },
        { html: "<strong>3.</strong> They live in London.<br>→ {{input}} in London?", inputType: "phrase", answers: ["do they live"] },
        { html: "<strong>4.</strong> He works in a bank.<br>→ {{input}} in a bank?", inputType: "phrase", answers: ["does he work"] },
        { html: "<strong>5.</strong> Your brother studies medicine.<br>→ {{input}} medicine?", inputType: "sentence", answers: ["does your brother study"] },
        { html: "<strong>6.</strong> You play the guitar.<br>→ {{input}} the guitar?", inputType: "phrase", answers: ["do you play"] },
        { html: "<strong>7.</strong> She works here.<br>→ {{input}} here?", inputType: "phrase", answers: ["does she work"] },
        { html: "<strong>8.</strong> They want help.<br>→ {{input}} help?", inputType: "phrase", answers: ["do they want"] },
        { html: "<strong>9.</strong> He reads newspapers.<br>→ {{input}} newspapers?", inputType: "phrase", answers: ["does he read"] },
        { html: "<strong>10.</strong> Your friends live nearby.<br>→ {{input}} nearby?", inputType: "sentence", answers: ["do your friends live"] }
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
          affirmative: "She plays tennis every Saturday.",
          negativeAnswer: "She doesn't play tennis every Saturday.",
          questionAnswer: "Does she play tennis every Saturday?"
        },
        {
          affirmative: "They live in a big city.",
          negativeAnswer: "They don't live in a big city.",
          questionAnswer: "Do they live in a big city?"
        },
        {
          affirmative: "He watches TV in the evening.",
          negativeAnswer: "He doesn't watch TV in the evening.",
          questionAnswer: "Does he watch TV in the evening?"
        },
        {
          affirmative: "We speak English in class.",
          negativeAnswer: "We don't speak English in class.",
          questionAnswer: "Do we speak English in class?"
        },
        {
          affirmative: "My cat sleeps on the sofa every day.",
          negativeAnswer: "My cat doesn't sleep on the sofa every day.",
          questionAnswer: "Does my cat sleep on the sofa every day?"
        },
        {
          affirmative: "Tom goes to work by bus.",
          negativeAnswer: "Tom doesn't go to work by bus.",
          questionAnswer: "Does Tom go to work by bus?"
        },
        {
          affirmative: "I like chocolate ice cream.",
          negativeAnswer: "I don't like chocolate ice cream.",
          questionAnswer: "Do I like chocolate ice cream?"
        },
        {
          affirmative: "The shop opens at nine o'clock.",
          negativeAnswer: "The shop doesn't open at nine o'clock.",
          questionAnswer: "Does the shop open at nine o'clock?"
        },
        {
          affirmative: "My sister studies English at school.",
          negativeAnswer: "My sister doesn't study English at school.",
          questionAnswer: "Does my sister study English at school?"
        },
        {
          affirmative: "Birds fly south in winter.",
          negativeAnswer: "Birds don't fly south in winter.",
          questionAnswer: "Do birds fly south in winter?"
        }
      ]
    }
  ]
};
