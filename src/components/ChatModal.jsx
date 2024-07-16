import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { OpenAI } from "openai";

const ChatModal = ({ pokemonName, handleClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [openai, setOpenai] = useState(null);
  const APIKEY = process.env.API_KEY;

  const scrollRef = useRef(null);

  useEffect(() => {
    setOpenai(
      new OpenAI({
        apiKey: APIKEY,
        dangerouslyAllowBrowser: true,
      })
    );
  }, [APIKEY]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [questions]);

  const handleQuestionChange = (e) => {
    setCurrentQuestion(e.target.value);
  };

  const handleQuestionSubmit = async () => {
    if (currentQuestion.trim() === "") return;

    const newQuestion = {
      question: currentQuestion,
      answer: "",
      isLoading: true,
    };

    setQuestions([...questions, newQuestion]); // 이전 질문 배열에 새 질문 추가
    setCurrentQuestion(""); // 현재 질문 초기화

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: currentQuestion,
          },
        ],
      });

      newQuestion.answer = response.choices[0].message.content;
    } catch (error) {
      console.error("Error:", error);
      newQuestion.answer = "답변을 가져오는 중 오류 발생";
    } finally {
      newQuestion.isLoading = false;
      setQuestions([...questions, newQuestion]); // 마지막 질문 상태 업데이트
    }
  };

  return (
    <ChatModalOverlay>
      <ChatModalContainer>
        <ModalTitleContainer>
          <ModalTitle>{pokemonName}에 대해 물어보세요~</ModalTitle>
          <ModalCloseButton onClick={handleClose}>X</ModalCloseButton>
        </ModalTitleContainer>
        <ModalQuestionContainer ref={scrollRef}>
          {questions.map((q, index) => (
            <ModalQA key={index}>
              <ModalQuestion>{q.question}</ModalQuestion>
              {q.isLoading && <ModalAnswer>loading...</ModalAnswer>}
              {!q.isLoading && <ModalAnswer>{q.answer}</ModalAnswer>}
            </ModalQA>
          ))}
        </ModalQuestionContainer>
        <ModalInputContainer>
          <ModalInput
            placeholder="질문을 입력해주세요"
            value={currentQuestion}
            onChange={handleQuestionChange}
          />
          <ModalButton onClick={handleQuestionSubmit}>전송</ModalButton>
        </ModalInputContainer>
      </ChatModalContainer>
    </ChatModalOverlay>
  );
};

export default ChatModal;

const ChatModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 40px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ChatModalContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  flex-direction: column;
  padding: 20px 40px;
  gap: 10px;
`;

const ModalTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ModalCloseButton = styled.button`
  border: none;
  background-color: transparent;
  font-weight: 900;
  font-size: large;
  font-family: "DOSIyagiBoldface", sans-serif;
  cursor: pointer;
`;

const ModalQuestionContainer = styled.div`
  max-height: 300px;
  width: 500px;
  overflow-y: auto; /* scroll로 변경 */
  padding: 10px;
  align-self: flex-end; // 추가
`;

const ModalQA = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  gap: 10px;
  width: 100%;
`;

const ModalQuestion = styled.div`
  font-size: 18px;
  background: rgba(0, 0, 255);
  color: white;
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
  align-self: flex-end; // 추가
`;

const ModalAnswer = styled.div`
  font-size: 18px;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
  align-self: flex-start; // 추가
`;
const ModalTitle = styled.h2`
  text-align: center;
`;

const ModalInputContainer = styled.div`
  display: flex;
  justify-content: flex-end; // 변경
  gap: 20px;
`;

const ModalInput = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
  border: 1px solid blue;
  border-radius: 10px;
  font-family: "DOSIyagiBoldface", sans-serif;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  height: 40px;
  background-color: blue;
  border: none;
  color: white;
  font-family: "DOSIyagiBoldface", sans-serif;
  border-radius: 12px;
  white-space: nowrap;
  cursor: pointer;

  &:active {
    background-color: #0000cf;
    color: white;
    transform: scale(0.9);
    transition: transform 0.3s ease-in-out;
  }
`;
