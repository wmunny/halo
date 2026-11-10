/**
 * Quiz de Validación
 * 3 preguntas obligatorias para verificar comprensión
 */

import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { quizValidacion } from '../../../data/pauContent';

export default function ValidationQuiz({ onComplete, quizData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Usar el quiz personalizado si se proporciona, o el general por defecto
  const activeQuiz = quizData || quizValidacion;

  const pregunta = activeQuiz.preguntas[currentQuestion];
  const isCorrect = selectedAnswer === pregunta?.respuestaCorrecta;
  const score = answers.filter((a, idx) => a === activeQuiz.preguntas[idx].respuestaCorrecta).length;
  const totalQuestions = activeQuiz.preguntas.length;

  const handleSelectAnswer = (optionId) => {
    if (showResult) return;
    setSelectedAnswer(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz terminado
      const finalScore = newAnswers.filter((a, idx) => a === activeQuiz.preguntas[idx].respuestaCorrecta).length;
      setQuizCompleted(true);
      
      // Si aprobó (todas correctas), notificar
      if (finalScore === totalQuestions) {
        setTimeout(() => onComplete(finalScore), 1500);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setQuizCompleted(false);
  };

  // Pantalla de resultados
  if (quizCompleted) {
    const passed = score + (selectedAnswer === pregunta?.respuestaCorrecta ? 1 : 0) >= totalQuestions;
    const finalScore = score + (selectedAnswer === pregunta?.respuestaCorrecta ? 1 : 0);

    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          {passed ? (
            <>
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-vitaly-azul mb-2">¡Quiz Aprobado!</h3>
              <p className="text-gray-500 mb-6">
                Has respondido correctamente a todas las preguntas
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="text-4xl font-bold text-green-500">{finalScore}/{totalQuestions}</div>
                <div className="text-sm text-green-700">Respuestas correctas</div>
              </div>
              <p className="text-sm text-gray-500">
                Redirigiendo a la firma...
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-vitaly-azul mb-2">Quiz No Aprobado</h3>
              <p className="text-gray-500 mb-6">
                Debes responder correctamente a todas las preguntas para continuar
              </p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="text-4xl font-bold text-red-500">{finalScore}/{totalQuestions}</div>
                <div className="text-sm text-red-700">Respuestas correctas</div>
              </div>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-vitaly-azul text-white font-bold rounded-xl hover:bg-vitaly-azul-hover transition-colors"
              >
                Intentar de Nuevo
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-vitaly-azul mb-2">{activeQuiz.titulo}</h3>
        <p className="text-gray-500">{activeQuiz.descripcion}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {activeQuiz.preguntas.map((_, idx) => (
          <div
            key={idx}
            className={`flex-1 h-2 rounded-full ${
              idx < currentQuestion
                ? 'bg-green-500'
                : idx === currentQuestion
                ? 'bg-vitaly-amarillo'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Pregunta */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-vitaly-amarillo/20 text-vitaly-azul text-sm font-semibold rounded-full">
              Pregunta {currentQuestion + 1} de {totalQuestions}
            </span>
          </div>

          <h4 className="text-lg font-semibold text-vitaly-azul mb-6">
            {pregunta.pregunta}
          </h4>

          {/* Opciones */}
          <div className="space-y-3">
            {pregunta.opciones.map((opcion) => {
              const isSelected = selectedAnswer === opcion.id;
              const isCorrectOption = opcion.id === pregunta.respuestaCorrecta;
              
              let optionClass = 'border-gray-200 bg-vitaly-gris-claro hover:border-vitaly-azul-40';
              
              if (showResult) {
                if (isCorrectOption) {
                  optionClass = 'border-green-500 bg-green-500/10';
                } else if (isSelected && !isCorrectOption) {
                  optionClass = 'border-red-500 bg-red-500/10';
                }
              } else if (isSelected) {
                optionClass = 'border-vitaly-azul bg-vitaly-azul-10';
              }

              return (
                <button
                  key={opcion.id}
                  onClick={() => handleSelectAnswer(opcion.id)}
                  disabled={showResult}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all ${optionClass}`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    showResult && isCorrectOption
                      ? 'border-green-500 bg-green-500'
                      : showResult && isSelected && !isCorrectOption
                      ? 'border-red-500 bg-red-500'
                      : isSelected
                      ? 'border-vitaly-azul bg-vitaly-azul'
                      : 'border-gray-300'
                  }`}>
                    {showResult && isCorrectOption ? (
                      <CheckCircle size={16} className="text-white" />
                    ) : showResult && isSelected && !isCorrectOption ? (
                      <XCircle size={16} className="text-white" />
                    ) : (
                      <span className={`text-sm font-semibold ${
                        isSelected ? 'text-white' : 'text-gray-500'
                      }`}>
                        {opcion.id.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className={`${
                    showResult && isCorrectOption
                      ? 'text-green-700'
                      : showResult && isSelected && !isCorrectOption
                      ? 'text-red-700'
                      : 'text-gray-700'
                  }`}>
                    {opcion.texto}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explicación */}
          {showResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              isCorrect 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {pregunta.explicacion}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con botones */}
        <div className="px-6 py-4 bg-vitaly-gris-claro border-t border-gray-200">
          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                selectedAnswer
                  ? 'bg-vitaly-azul text-white hover:bg-vitaly-azul-hover'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Comprobar Respuesta
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3 bg-vitaly-azul text-white font-semibold rounded-lg hover:bg-vitaly-azul-hover transition-colors flex items-center justify-center gap-2"
            >
              {currentQuestion < totalQuestions - 1 ? (
                <>
                  Siguiente Pregunta
                  <ArrowRight size={18} />
                </>
              ) : (
                'Ver Resultados'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


