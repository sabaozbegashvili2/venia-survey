import { gql } from '@apollo/client';

const GET_SURVEY = gql`
    query medicalSurvey {
        medicalSurvey {
            title
            formHeading
            questions
        }
    }
`;

const SAVE_SURVEY_RESULTS = gql`
    mutation saveSurveyResults($cartId: String!, $surveyResults: String!) {
        saveSurveyResults(input: {cartId: $cartId, surveyResults: $surveyResults}) {
            error
        }
    }
`;

export default {
    getSurveyQuery: GET_SURVEY,
    saveSurveyResultsMutation: SAVE_SURVEY_RESULTS
}
