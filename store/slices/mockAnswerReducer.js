const { createSlice } = require("@reduxjs/toolkit");

const slice = createSlice({
    name: 'mockAnswers',
    initialState:
    {
        responses : []
    },
    reducers:
    {
        addAnswerTemplate(state, action)
        {
            const { length, flag, data } = action.payload;
            if(flag)
                state.responses = data
            else
            {
                state.responses = []; 
                Array.from({length}).forEach(()=>
                {
                    state.responses.push({
                        answers: [],
                        isFlagged: false
                    })
                })
            }
        },
        updateAnswer(state, action)
        {
            const { index, answer, isFlagged } = action.payload
            const existingAnswers = state.responses[index]?.answers;
            const updatedAnswers = [...existingAnswers, answer]
            state.responses[index] = { answers: updatedAnswers, isFlagged };
        },
        updateOptions(state, action)
        {
            const { index, option, isFlagged } = action.payload;
            const updatedAnswers = state.responses[index].answers.filter((opt)=> opt !== option)
            state.responses[index] = { answers: updatedAnswers, isFlagged };
        },
        flagQuestion(state, action)
        {
            const { index, isFlagged } = action.payload;
            const answers = []
            state.responses[index] = { answers, isFlagged };
        },
        updateVerdict(state, action)
        {
            const { index, verdict } = action.payload;
            state.responses[index] = {...state.responses[index], verdict};
        }
    }
})

export const { addAnswerTemplate, updateAnswer, updateOptions, flagQuestion, updateVerdict } = slice.actions
export default slice.reducer