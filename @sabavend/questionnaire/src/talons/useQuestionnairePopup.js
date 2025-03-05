import {useEffect, useState} from "react";
import {useIntl} from "react-intl";
import DEFAULT_OPERATIONS from './questionnairePopup.gql';
import { useQuery, useMutation } from '@apollo/client';
import {useCartContext} from "@magento/peregrine/lib/context/cart";
import DUMMY_SURVEY from './dummySurvey'

export const ANSWER_YES = 'yes';
export const ANSWER_NO = 'no';
const TARGET_PRODUCT = '99999';

const useQuestionnairePopup = ({ cartItems }) => {
    const { formatMessage } = useIntl();
    const { getSurveyQuery, saveSurveyResultsMutation } = DEFAULT_OPERATIONS;
    const [errors, setErrors] = useState({});
    const [responses, setResponses] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [{ cartId }] = useCartContext();
    const qualifiesCondition = cartItems.some(item => item.product.sku === TARGET_PRODUCT);

    // This query won't work if GQL endpoints from magento 2 is not exposed/created
    // if you want to test this, we'd either create endpoints or we comment out two lines below
    // and uncomment dummy test data

    const { data, loading, error } = useQuery(getSurveyQuery);
    const { title, formHeading, questions = [] } = data?.survey || {};

    // ------ TEST USING DUMMY DATA
    // const loading = false;
    // const error = false;
    // const data = { survey: DUMMY_SURVEY };
    // const { title, formHeading, questions = [] } = data.survey;

    const [saveSurveyResults, { loading: isMutationLoading }] = useMutation(saveSurveyResultsMutation);

    useEffect(() => {
        if (qualifiesCondition) {
            setIsOpen(true);
        }
    }, [qualifiesCondition]);

    const handleAnswer = (idx, answer) => {
        setResponses(prev => ({
            ...prev,
            [idx]: answer
        }));

        if (errors[idx]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[idx];

                return next;
            });
        }
    };

    const handleSubmit = async () => {
        try {
            const newErrors = {};

            questions.forEach((_, idx) => {
                if (!responses[idx]) {
                    newErrors[idx] = formatMessage({ id: 'questionnaire.submitError', defaultMessage: 'Please select an answer' });
                }
            });

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);

                return;
            }


            const surveyResults = {};
            data.survey.questions.forEach((question, index) => {
                surveyResults[question] = responses[index] === ANSWER_YES ? 'Positive' : 'Negative';
            });

            const stringifiedSurveyResult = JSON.stringify(surveyResults);

            const response = await saveSurveyResults({
                variables: {
                    cartId,
                    surveyResults: stringifiedSurveyResult
                }
            });

            if (!response.data.saveSurveyResults.error) {
                setIsOpen(false);
                setResponses({});
            } else {
                console.error('Error while saving survey');
            }
        } catch (err) {
            console.error('Error while submitting survey:', err);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setErrors({});
    };

    return {
        title,
        formHeading,
        questions,
        handleClose,
        handleSubmit,
        responses,
        handleAnswer,
        errors,
        isOpen,
        isQueryLoading: loading,
        isMutationLoading,
        error
    }
}

export default useQuestionnairePopup;
