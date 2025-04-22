
import React, { useState, useEffect, useRef } from 'react';
import { notification, Input, Button, Typography, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { FaRobot, FaUserCircle } from 'react-icons/fa';

const { Title, Text } = Typography;

export default function FormViewerWithAI() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
    const formData = savedForms.find(form => form.id === formId);
    if (formData) {
      setForm(formData);
      setChatHistory([
        { type: 'bot', message: `Welcome! Let's get started with the form: ${formData.name}.` },
        { type: 'bot', message: formData.fields[0].label },
      ]);
    } else {
      notification.error({
        message: 'Form Not Found',
        description: 'The form you are trying to access does not exist.',
      });
    }
    setLoading(false);
  }, [formId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const validateInput = (input, field) => {
    if (field.required && !input.trim()) {
      notification.error({
        message: 'Input Required',
        description: `Please provide a valid answer for ${field.label}.`,
      });
      return false;
    }

    if (field.type === 'email' && input.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(input)) {
        notification.error({
          message: 'Invalid Email',
          description: 'Please provide a valid email address.',
        });
        return false;
      }
    }

    return true;
  };

  // const handleNextQuestion = () => {
  //   if (!validateInput(userInput, form.fields[currentQuestionIndex])) {
  //     return;
  //   }

  //   const updatedChat = [
  //     ...chatHistory,
  //     { type: 'user', message: userInput },
  //   ];

  //   const nextIndex = currentQuestionIndex + 1;

  //   if (nextIndex < form.fields.length) {
  //     setTimeout(() => {
  //       updatedChat.push({
  //         type: 'bot',
  //         message: form.fields[nextIndex].label,
  //       });
  //       setChatHistory(updatedChat);
  //       setCurrentQuestionIndex(nextIndex);
  //       setUserInput('');
  //     }, 300);
  //   } else {
  //     setFormSubmitted(true);
  //     updatedChat.push({
  //       type: 'bot',
  //       message: 'All questions are answered. Click Submit to finish the form.',
  //     });
  //     setChatHistory(updatedChat);
  //     setUserInput('');
  //   }
  // };


  const handleNextQuestion = () => {
    const currentField = form.fields[currentQuestionIndex];
  
    // Validate input
    if (!validateInput(userInput, currentField)) {
      return;
    }
  
    // Check for duplicate email if the field is email
    if (currentField.type === 'email') {
      const savedData = JSON.parse(localStorage.getItem(`form_${formId}_data`));
      if (savedData && Array.isArray(savedData.answers)) {
        const existingEmail = savedData.answers.find(ans =>
          ans.question.toLowerCase().includes('email') &&
          ans.answer.toLowerCase() === userInput.toLowerCase()
        );
        if (existingEmail) {
          notification.error({
            message: 'Form Already Submitted',
            description: 'This email has already been used to submit the form.',
          });
          return;
        }
      }
    }
  
    const updatedChat = [
      ...chatHistory,
      { type: 'user', message: userInput },
    ];
  
    const nextIndex = currentQuestionIndex + 1;
  
    if (nextIndex < form.fields.length) {
      setTimeout(() => {
        updatedChat.push({
          type: 'bot',
          message: form.fields[nextIndex].label,
        });
        setChatHistory(updatedChat);
        setCurrentQuestionIndex(nextIndex);
        setUserInput('');
      }, 300);
    } else {
      setFormSubmitted(true);
      updatedChat.push({
        type: 'bot',
        message: 'All questions are answered. Click Submit to finish the form.',
      });
      setChatHistory(updatedChat);
      setUserInput('');
    }
  };
  
  const handleSubmit = () => {
    const formDataToSave = { id: form.id, answers: [] };

    form.fields.forEach((field, index) => {
      const answer = chatHistory.find(
        (chat, i) =>
          chat.type === 'user' &&
          chatHistory.findIndex(c => c.type === 'bot' && c.message === field.label) < i
      )?.message || '';
      formDataToSave.answers.push({ question: field.label, answer });
    });

    localStorage.setItem(`form_${formId}_data`, JSON.stringify(formDataToSave));

    form.fields.forEach((_, index) => {
      localStorage.removeItem(`answer_${formId}_${index}`);
    });

    notification.success({
      message: 'Form Submitted',
      description: 'Your form has been submitted successfully!',
    });

    // Reset for a new form session
    setFormSubmitted(false);
    setCurrentQuestionIndex(0);
    setUserInput('');
    setChatHistory([
      { type: 'bot', message: `Welcome! Let's get started with the form: ${form.name}.` },
      { type: 'bot', message: form.fields[0].label },
    ]);
  };

  if (loading) return <div className="text-center p-8"><Spin size="large" /></div>;
  if (!form) return <div>Loading...</div>;

  return (
    <div className="p-6 mx-auto shadow-xl rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 h-screen flex flex-col">
      <Title level={3} className="text-center text-white font-semibold mb-2">{form.name}</Title>
      <Text className="block text-center mb-4 text-white text-lg">{form.description}</Text>

      <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-white rounded-lg shadow-lg mb-4 transition-all">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`flex ${chat.type === 'bot' ? 'items-start' : 'justify-end'}`}
          >
            {chat.type === 'bot' ? (
              <div className="flex items-start space-x-3 bg-blue-100 text-gray-800 p-4 rounded-lg max-w-xs shadow-md animate-fadeIn">
                <FaRobot className="text-blue-500 text-xl mt-1" />
                <span className="text-lg font-medium">{chat.message}</span>
              </div>
            ) : (
              <div className="flex items-start space-x-3 bg-gray-200 text-black p-4 rounded-lg max-w-xs shadow-md animate-fadeIn">
                <span className="text-lg font-medium">{chat.message}</span>
                <FaUserCircle className="text-gray-500 text-xl mt-1" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex justify-center items-center space-x-3">
        {!formSubmitted ? (
          <>
            <Input
              placeholder="Type your answer..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onPressEnter={handleNextQuestion}
              className="w-full"
              style={{ borderRadius: '30px', padding: '12px' }}
            />
            <Button
              type="primary"
              onClick={handleNextQuestion}
              style={{ borderRadius: '30px', padding: '12px 24px' }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Send
            </Button>
          </>
        ) : (
          <>
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ borderRadius: '30px', padding: '12px 24px' }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Submit
            </Button>
            <Button
              onClick={() => {
                setFormSubmitted(false);
                setCurrentQuestionIndex(0);
                setUserInput('');
                setChatHistory([
                  { type: 'bot', message: `Welcome! Let's get started with the form: ${form.name}.` },
                  { type: 'bot', message: form.fields[0].label },
                ]);
              }}
              style={{ borderRadius: '30px', padding: '12px 24px', marginLeft: '1rem' }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Fill Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}



// import React, { useState, useEffect, useRef } from 'react';
// import { notification, Input, Button, Typography, Spin } from 'antd';
// import { useParams } from 'react-router-dom';
// import { FaRobot, FaUserCircle } from 'react-icons/fa';

// const { Title, Text } = Typography;

// export default function FormViewerWithAI() {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     setLoading(true);
//     const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
//     const formData = savedForms.find(form => form.id === formId);
//     if (formData) {
//       setForm(formData);
//       setChatHistory([
//         { type: 'bot', message: `Welcome! Let's get started with the form: ${formData.name}.` },
//         { type: 'bot', message: formData.fields[0].label }, // Ask the first question
//       ]);
//     } else {
//       notification.error({
//         message: 'Form Not Found',
//         description: 'The form you are trying to access does not exist.',
//       });
//     }
//     setLoading(false);
//   }, [formId]);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [chatHistory]);

//   const validateInput = (input, field) => {
//     // Check if the field is required
//     if (field.required && !input.trim()) {
//       notification.error({
//         message: 'Input Required',
//         description: `Please provide a valid answer for ${field.label}.`,
//       });
//       return false;
//     }

//     // If it's an email field, validate email format
//     if (field.type === 'email' && input.trim()) {
//       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//       if (!emailRegex.test(input)) {
//         notification.error({
//           message: 'Invalid Email',
//           description: 'Please provide a valid email address.',
//         });
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleNextQuestion = () => {
//     if (!validateInput(userInput, form.fields[currentQuestionIndex])) {
//       return;
//     }

//     const updatedChat = [
//       ...chatHistory,
//       { type: 'user', message: userInput },
//     ];

//     const nextIndex = currentQuestionIndex + 1;

//     if (nextIndex < form.fields.length) {
//       setTimeout(() => {
//         updatedChat.push({
//           type: 'bot',
//           message: form.fields[nextIndex].label,
//         });
//         setChatHistory(updatedChat);
//         setCurrentQuestionIndex(nextIndex);
//         setUserInput('');
//       }, 300);
//     } else {
//       setFormSubmitted(true);
//       updatedChat.push({
//         type: 'bot',
//         message: 'All questions are answered. Click Submit to finish the form.',
//       });
//       setChatHistory(updatedChat);
//       setUserInput('');
//     }
//   };

//   const handleSubmit = () => {
//     const formData = { id: form.id, answers: [] };
//     form.fields.forEach((field, index) => {
//       formData.answers.push({ question: field.label, answer: localStorage.getItem(`answer_${formId}_${index}`) });
//     });
//     localStorage.setItem(`form_${formId}_data`, JSON.stringify(formData));
//     notification.success({
//       message: 'Form Submitted',
//       description: 'Your form has been submitted successfully!',
//     });
//     // You can also make an API call here to save the form data on the server
//   };

//   if (loading) return <div className="text-center p-8"><Spin size="large" /></div>;
//   if (!form) return <div>Loading...</div>;

//   return (
//     <div className="p-6 mx-auto shadow-xl rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 h-screen flex flex-col">
//       <Title level={3} className="text-center text-white font-semibold mb-2">{form.name}</Title>
//       <Text className="block text-center mb-4 text-white text-lg">{form.description}</Text>

//       <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-white rounded-lg shadow-lg mb-4 transition-all">
//         {chatHistory.map((chat, index) => (
//           <div
//             key={index}
//             className={`flex ${chat.type === 'bot' ? 'items-start' : 'justify-end'}`}
//           >
//             {chat.type === 'bot' ? (
//               <div className="flex items-start space-x-3 bg-blue-100 text-gray-800 p-4 rounded-lg max-w-xs shadow-md animate-fadeIn">
//                 <FaRobot className="text-blue-500 text-xl mt-1" />
//                 <span className="text-lg font-medium">{chat.message}</span>
//               </div>
//             ) : (
//               <div className="flex items-start space-x-3 bg-gray-200 text-black p-4 rounded-lg max-w-xs shadow-md animate-fadeIn">
//                 <span className="text-lg font-medium">{chat.message}</span>
//                 <FaUserCircle className="text-gray-500 text-xl mt-1" />
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="flex justify-center items-center space-x-3">
//   {!formSubmitted ? (
//     <>
//       <Input
//         placeholder="Type your answer..."
//         value={userInput}
//         onChange={(e) => setUserInput(e.target.value)}
//         onPressEnter={handleNextQuestion}
//         className="w-full "
//         style={{ borderRadius: '30px', padding: '12px' }}
//       />
//       <Button
//         type="primary"
//         onClick={handleNextQuestion}
//         style={{ borderRadius: '30px', padding: '12px 24px' }}
//         className="bg-blue-600 hover:bg-blue-700 text-white"
//       >
//         Send
//       </Button>
//     </>
//   ) : (
//     <Button
//       type="primary"
//       onClick={handleSubmit}
//       style={{ borderRadius: '30px', padding: '12px 24px' }}
//       className="bg-green-600 hover:bg-green-700 text-white"
//     >
//       Submit
//     </Button>
//   )}
// </div>

//     </div>
//   );
// }


// import React, { useState, useEffect, useRef } from 'react';
// import { notification, Input, Button, Typography, Spin } from 'antd';
// import { useParams } from 'react-router-dom';
// import { FaRobot, FaUserCircle } from 'react-icons/fa';

// const { Title, Text } = Typography;

// export default function FormViewerWithAI() {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     setLoading(true);
//     const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
//     const formData = savedForms.find(form => form.id === formId);
//     if (formData) {
//       setForm(formData);
//       setChatHistory([
//         {
//           type: 'bot',
//           message: formData.fields[0].label,
//         },
//       ]);
//     } else {
//       notification.error({
//         message: 'Form Not Found',
//         description: 'The form you are trying to access does not exist.',
//       });
//     }
//     setLoading(false);
//   }, [formId]);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [chatHistory]);

//   const validateInput = (input, field) => {
//     // Check if the field is required
//     if (field.required && !input.trim()) {
//       notification.error({
//         message: 'Input Required',
//         description: `Please provide a valid answer for ${field.label}.`,
//       });
//       return false;
//     }

//     // If it's an email field, validate email format
//     if (field.type === 'email' && input.trim()) {
//       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//       if (!emailRegex.test(input)) {
//         notification.error({
//           message: 'Invalid Email',
//           description: 'Please provide a valid email address.',
//         });
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleNextQuestion = () => {
//     if (!validateInput(userInput, form.fields[currentQuestionIndex])) {
//       return;
//     }

//     const updatedChat = [
//       ...chatHistory,
//       { type: 'user', message: userInput },
//     ];

//     const nextIndex = currentQuestionIndex + 1;

//     if (nextIndex < form.fields.length) {
//       setTimeout(() => {
//         updatedChat.push({
//           type: 'bot',
//           message: form.fields[nextIndex].label,
//         });
//         setChatHistory(updatedChat);
//         setCurrentQuestionIndex(nextIndex);
//         setUserInput('');
//       }, 300);
//     } else {
//       notification.success({
//         message: 'Form Submitted',
//         description: 'Thank you for completing the form.',
//       });
//       setChatHistory(updatedChat);
//       setUserInput('');
//     }
//   };

//   if (loading) return <div className="text-center p-8"><Spin size="large" /></div>;
//   if (!form) return <div>Loading...</div>;

//   return (
//     <div className="p-6 mx-auto shadow-xl rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 h-screen flex flex-col">
//       <Title level={3} className="text-center text-white font-semibold mb-2">{form.name}</Title>
//       <Text className="block text-center mb-4 text-white text-lg">{form.description}</Text>

//       <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-white rounded-lg shadow-lg mb-4 transition-all">
//         {chatHistory.map((chat, index) => (
//           <div
//             key={index}
//             className={`flex ${chat.type === 'bot' ? 'items-start' : 'justify-end'}`}
//           >
//             {chat.type === 'bot' ? (
//               <div className="flex items-start space-x-3 bg-blue-100 text-gray-800 p-4 rounded-lg max-w-xs shadow-md animate-fadeIn">
//                 <FaRobot className="text-blue-500 text-xl mt-1" />
//                 <span className="text-lg font-medium">{chat.message}</span>
//               </div>
//             ) : (
//               <div className="flex items-start space-x-3 bg-gray-200 text-black p-4 rounded-lg max-w-xs shadow-md animate-fadeIn">
//                 <span className="text-lg font-medium">{chat.message}</span>
//                 <FaUserCircle className="text-gray-500 text-xl mt-1" />
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="flex space-x-3">
//         <Input
//           placeholder="Type your answer..."
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           onPressEnter={handleNextQuestion}
//           className="w-full max-w-md"
//           style={{ borderRadius: '30px', padding: '12px' }}
//         />
//         <Button
//           type="primary"
//           onClick={handleNextQuestion}
//           style={{ borderRadius: '30px', padding: '12px 24px' }}
//           className="bg-blue-600 hover:bg-blue-700 text-white"
//         >
//           Send
//         </Button>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect, useRef } from 'react';
// import { notification, Input, Button, Typography, Spin } from 'antd';
// import { useParams } from 'react-router-dom';
// import { FaRobot, FaUserCircle } from 'react-icons/fa';

// const { Title, Text } = Typography;

// export default function FormViewerWithAI() {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     setLoading(true);
//     const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
//     const formData = savedForms.find(form => form.id === formId);
//     if (formData) {
//       setForm(formData);
//       setChatHistory([
//         {
//           type: 'bot',
//           message: formData.fields[0].label,
//         },
//       ]);
//     } else {
//       notification.error({
//         message: 'Form Not Found',
//         description: 'The form you are trying to access does not exist.',
//       });
//     }
//     setLoading(false);
//   }, [formId]);

//   useEffect(() => {
//     // Smooth scroll to bottom on new message
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [chatHistory]);

//   const handleNextQuestion = () => {
//     if (!userInput.trim()) {
//       notification.error({
//         message: 'Answer Required',
//         description: 'Please provide an answer before continuing.',
//       });
//       return;
//     }

//     const updatedChat = [
//       ...chatHistory,
//       { type: 'user', message: userInput },
//     ];

//     const nextIndex = currentQuestionIndex + 1;

//     if (nextIndex < form.fields.length) {
//       setTimeout(() => {
//         updatedChat.push({
//           type: 'bot',
//           message: form.fields[nextIndex].label,
//         });
//         setChatHistory(updatedChat);
//         setCurrentQuestionIndex(nextIndex);
//         setUserInput('');
//       }, 300); // slight delay for natural flow
//     } else {
//       notification.success({
//         message: 'Form Submitted',
//         description: 'Thank you for completing the form.',
//       });
//       setChatHistory(updatedChat);
//       // Save the response here if needed
//       setUserInput('');
//     }
//   };

//   if (loading) return <div className="text-center p-8"><Spin size="large" /></div>;
//   if (!form) return <div>Loading...</div>;

//   return (
//     <div className="p-6 mx-auto shadow-xl rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 h-screen flex flex-col ">
//       <Title level={3} className="text-center text-white font-semibold mb-2">{form.name}</Title>
//       <Text className="block text-center mb-4 text-white text-lg">{form.description}</Text>

//       <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-white rounded-lg shadow-lg mb-4 transition-all">
//         {chatHistory.map((chat, index) => (
//           <div
//             key={index}
//             className={`flex ${chat.type === 'bot' ? 'items-start' : 'justify-end'}`}
//           >
//             {chat.type === 'bot' ? (
//               <div className="flex items-start space-x-3 bg-blue-100 text-gray-800 p-4 rounded-lg max-w-xs shadow-md animate-fadeIn">
//                 <FaRobot className="text-blue-500 text-xl mt-1" />
//                 <span className="text-lg font-medium">{chat.message}</span>
//               </div>
//             ) : (
//               <div className="flex items-start space-x-3 bg-gray-200 text-black p-4 rounded-lg max-w-xs shadow-md animate-fadeIn">
//                 <span className="text-lg font-medium">{chat.message}</span>
//                 <FaUserCircle className="text-gray-500 text-xl mt-1" />
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="flex space-x-3">
//         <Input
//           placeholder="Type your answer..."
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           onPressEnter={handleNextQuestion}
//           className="w-full max-w-md"
//           style={{ borderRadius: '30px', padding: '12px' }}
//         />
//         <Button 
//           type="primary" 
//           onClick={handleNextQuestion}
//           style={{ borderRadius: '30px', padding: '12px 24px' }}
//           className="bg-blue-600 hover:bg-blue-700 text-white"
//         >
//           Send
//         </Button>
//       </div>
//     </div>
//   );
// }
