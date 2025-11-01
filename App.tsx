import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PromptBuilder from './components/PromptBuilder';
import EditTabs from './components/EditTabs';

// To prevent re-rendering, define static components outside the main App component.

const WhatIsSection: React.FC<{ imageUrl: string | null; prompt: string }> = ({ imageUrl, prompt }) => {
    const displayPrompt = prompt || '一隻戴著墨鏡的柴犬貼紙在衝浪';
    return (
        <section id="what-is" className="py-16">
            <h2 className="text-3xl font-bold text-center text-white sm:text-4xl mb-12">什麼是 AI 貼紙生成？</h2>
            <p className="text-lg text-center text-gray-300 max-w-2xl mx-auto mb-10">
                AI 貼紙生成，就像一個「魔法設計師」。你只要用<strong>文字</strong>告訴它你想畫什麼貼紙，它就能「憑空」為你創造出獨一-無二的貼紙圖案。
            </p>
            <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                    <div className="p-8 text-center md:text-right">
                        <h3 className="text-xl font-semibold text-white mb-2">1. 你的貼紙靈感 (輸入)</h3>
                        <p className="text-gray-300">{`「${displayPrompt}」`}</p>
                    </div>
                    <div className="text-center text-5xl text-indigo-400 font-bold transform md:rotate-0 rotate-90">
                        →
                    </div>
                    <div className="p-8">
                        <h3 className="text-xl font-semibold text-white mb-2 text-center md:text-left">2. AI 生成的貼紙</h3>
                        <div className="w-full h-auto aspect-video rounded-lg shadow-md bg-slate-700">
                             <img src={imageUrl || "https://i.ibb.co/k51nNfp/final-cat.png"} 
                                 alt={`AI生成：${displayPrompt}`}
                                 className="rounded-lg w-full h-full object-contain"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const NoiseCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const randomColor = Math.floor(Math.random() * 255);
            data[i] = randomColor;     // Red
            data[i + 1] = randomColor; // Green
            data[i + 2] = randomColor; // Blue
            data[i + 3] = 255;         // Alpha
        }

        ctx.putImageData(imageData, 0, 0);

    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="w-full h-full"
            aria-label="A canvas displaying randomly generated noise to simulate the start of an AI image generation process."
        >
        </canvas>
    );
};

const HowItWorksSection: React.FC<{ imageUrl: string | null }> = ({ imageUrl }) => {
    const [simulationStage, setSimulationStage] = useState<number>(0);

    const effectiveImageUrl = imageUrl || "https://i.ibb.co/k51nNfp/final-cat.png";

    const stages = [
        {
            title: '步驟一：從雜訊開始',
            description: 'AI 從一張隨機的雜訊圖像開始。',
        },
        {
            title: '步驟二：逐步清晰化',
            description: '根據你的文字提示，慢慢將細節從雜訊中「雕刻」出來。',
        },
        {
            title: '步驟三：生成最終圖像',
            description: '完成去雜訊，呈現符合你描述的清晰圖像。',
        },
    ];
    
    useEffect(() => {
        setSimulationStage(0);
    }, [imageUrl]);

    const handleNextStep = () => {
        if (simulationStage < stages.length - 1) {
            setSimulationStage(prev => prev + 1);
        }
    };
    
    const handleRestart = () => {
        setSimulationStage(0);
    }

    const currentStage = stages[simulationStage];

    const renderImageStage = () => {
        switch (simulationStage) {
            case 0:
                return <NoiseCanvas />;
            case 1:
                return (
                    <div className="relative w-full h-full">
                        <div 
                            className="w-full h-full bg-cover bg-center filter blur-lg"
                            style={{ backgroundImage: `url(${effectiveImageUrl})` }}
                        />
                        <div className="absolute inset-0 opacity-60">
                            <NoiseCanvas />
                        </div>
                    </div>
                );
            case 2:
                return (
                     <div 
                        className="w-full h-full bg-contain bg-no-repeat bg-center"
                        style={{ backgroundImage: `url(${effectiveImageUrl})` }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <section id="how-it-works" className="py-16">
            <h2 className="text-3xl font-bold text-center text-white sm:text-4xl mb-12">幕後解密：AI 如何「學會」畫貼紙？</h2>
            <p className="text-lg text-center text-gray-300 max-w-2xl mx-auto mb-10">
                AI 從雜訊中「雕刻」出你的貼紙圖案。點擊「下一步」按鈕，逐步觀看您的圖片是如何從無到有生成的！
            </p>
            <div className="bg-slate-800 p-8 rounded-lg shadow-xl flex flex-col items-center">
                <div className="w-full max-w-md text-center">
                    <div 
                        className="w-full aspect-square rounded-lg shadow-md bg-slate-700 overflow-hidden"
                        aria-live="polite"
                    >
                        {renderImageStage()}
                    </div>
                    <div className="mt-4 h-16">
                        <h4 className="text-xl font-semibold text-white mt-3">{currentStage.title}</h4>
                        <p className="text-gray-400">{currentStage.description}</p>
                    </div>
                </div>
                {simulationStage < stages.length - 1 ? (
                    <button
                        onClick={handleNextStep}
                        className="mt-6 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-500 transition"
                    >
                        下一步
                    </button>
                ) : (
                    <button
                        onClick={handleRestart}
                        className="mt-6 bg-purple-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-purple-500 transition"
                    >
                        ✨ 重新模擬
                    </button>
                )}
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-slate-900 text-center py-8">
        <p className="text-gray-400">&copy; 2025 繪出獨一無二：你的貼紙. 內容僅供教學使用。</p>
    </footer>
);

const ProgressIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep }) => {
    const steps = ['開始創作', '什麼是AI', '運作原理', '如何下指令', '圖片編輯'];
    return (
        <div className="container mx-auto px-6 pt-8 pb-4">
            <div className="flex justify-between items-start">
                {steps.map((title, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center text-center w-1/5">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                    index <= currentStep ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-700 border-slate-600 text-gray-400'
                                }`}
                            >
                                {index < currentStep ? '✓' : index + 1}
                            </div>
                            <p className={`mt-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>{title}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 mt-5 mx-2 sm:mx-4 rounded ${index < currentStep ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [promptBuilderImage, setPromptBuilderImage] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const totalSteps = 5;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
    }
  };
  
  const restart = () => {
    setCurrentStep(0);
    setGeneratedImage(null);
    setPromptBuilderImage(null);
    setLastPrompt('');
  }

  const renderStepContent = () => {
    switch (currentStep) {
        case 0: return <HeroSection 
                          generatedImage={generatedImage} 
                          onImageGenerated={setGeneratedImage}
                          onPromptUsed={setLastPrompt}
                        />;
        case 1: return <WhatIsSection imageUrl={generatedImage} prompt={lastPrompt} />;
        case 2: return <HowItWorksSection imageUrl={generatedImage} />;
        case 3: return <PromptBuilder onImageGenerated={setPromptBuilderImage} />;
        case 4: return <EditTabs imageUrl={promptBuilderImage} />;
        default: return <HeroSection 
                          generatedImage={generatedImage} 
                          onImageGenerated={setGeneratedImage}
                          onPromptUsed={setLastPrompt}
                        />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <main className="container mx-auto px-6 py-8">
          {renderStepContent()}
        </main>
      </div>
      
      <div className="sticky bottom-0 bg-slate-800/80 backdrop-blur-sm shadow-inner py-4 mt-8">
          <div className="container mx-auto px-6 flex justify-between items-center">
              <button 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="bg-slate-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-slate-500 transition disabled:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                aria-label="Previous Step"
              >
                上一關
              </button>
              
              {currentStep < totalSteps - 1 ? (
                <button 
                  onClick={nextStep}
                  disabled={
                    (currentStep === 0 && !generatedImage) ||
                    (currentStep === 3 && !promptBuilderImage)
                  }
                  className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-500 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  aria-label="Next Step"
                >
                  下一關
                </button>
              ) : (
                <button 
                  onClick={restart}
                  className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-purple-500 transition"
                  aria-label="Restart"
                >
                  重新開始
                </button>
              )}
          </div>
      </div>
      <Footer />
    </div>
  );
}