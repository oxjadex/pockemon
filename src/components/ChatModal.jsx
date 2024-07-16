import React, { useState } from "react";
import styled from "styled-components";
import { OpenAI } from "openai";

const ChatModal = ({ pokemonName, handleClose }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const APIKEY = process.env.API_KEY;

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const openai = new OpenAI({
    apiKey: APIKEY,
    dangerouslyAllowBrowser: true,
  });

  const handleQuestionSubmit = async () => {
    if (question.trim() === "") return;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      });
      setAnswer(response.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        if (error.response.status === 429) {
          console.log("요청 제한 초과");
        } else {
          console.log("답변을 가져오는 중 오류 발생");
        }
      } else {
        console.log("네트워크 오류");
      }
    }
  };

  return (
    <ChatModalOverlay>
      <ChatModalContainer>
        <ModalTitleContainer>
          <ModalTitle>{pokemonName}에 대해 물어보세요~</ModalTitle>
          <ModalCloseButton onClick={handleClose}>X</ModalCloseButton>
        </ModalTitleContainer>
        <ModalInputContainer>
          <ModalInput
            placeholder="질문을 입력해주세요"
            value={question}
            onChange={handleQuestionChange}
          />
          <ModalButton onClick={handleQuestionSubmit}>전송</ModalButton>
        </ModalInputContainer>
        <ModalAnswer>{answer}</ModalAnswer>
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

const ModalTitle = styled.h2`
  text-align: center;
`;

const ModalInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
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

const ModalAnswer = styled.div`
  width: 600px;
  height: 100%;
`;
