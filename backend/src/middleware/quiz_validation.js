import { body, validationResult } from "express-validator";

export const validateQuiz = [
  body("title") //validate title
    .notEmpty()
    .withMessage("Title is required!")
    .isString()
    .withMessage("Title must be a string!"),
  body("description").isString().withMessage("Description must be a string!"), //validate description
  body("questions") //validate questions
    .isArray({ min: 1 })
    .withMessage("Questions must be an array!")
    .custom((questions) => {
      const questionTexts = questions.map((q) =>
        q.question.toLowerCase().trim()
      );
      const uniqueQuestions = new Set(questionTexts);
      if (uniqueQuestions.size !== questionTexts.length) {
        throw new Error("Dupicate question is not allowed!");
      }
      if (questionTexts.some((question) => question === "")) {
        throw new Error("Empty questions are not allowed!");
      }
      return true;
    }),
  body("questions.*.question") //validate one question at a time
    .notEmpty()
    .withMessage("Each question must have a text!")
    .isString()
    .withMessage("Each question must be a string!"),
  body("questions.*.options") //validation options one question at a time
    .isArray({ min: 2 })
    .withMessage("Each question must have at least 2 options!")
    .custom((options) => {
      return options.every((options) => typeof options === "string");
    })
    .withMessage("All options must be strings")
    .custom((options) => {
      const newOptions = options.map((options) => options.toLowerCase().trim());
      const optionSet = new Set(newOptions);
      if (newOptions.some((option) => option === "")) {
        throw new Error("Empty options are not allowed!");
      }
      if (optionSet.size !== options.length) {
        throw new Error("Duplicate options are not allowed!");
      }
      return true;
    }),
  body("questions.*.answer") //check if answer matches one of the options
    .notEmpty()
    .withMessage("Each question must have an answer!")
    .isString()
    .withMessage("Answer must be a string!")
    .custom(({ req, path }) => {
      //Extract index from the request
      // *
      const index = parseInt(path.match(/\d+/)[0], 10);
      const options = req.body.questions[index].options;
      const answer = req.body.questions[index].answer;
      if (!options.includes(answer)) {
        throw new Error("Answer must be one of the options");
      }
      return true;
    }),
];

//*express-validator automatically makes this format
//<field_name>.<index>.<sub_field>
