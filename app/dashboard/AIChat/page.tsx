import { ChatbotEmbed } from '@/app/components/ChatbotEmbed';

export default function AIAssistant() {
  return (
    <div className='h-screen flex flex-col items-center justify-center p-6 overflow-hidden'>
      <div className='max-w-4xl w-full flex flex-col h-full max-h-[900px]'>
        <div className='text-center mb-6 flex-shrink-0'>
          <h1 className="font-bold text-3xl mb-2">
            AI Fitness <span className="text-blue-500">Assistant</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-md">
            Get personalized workout advice, nutrition tips, and fitness guidance
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex-1 flex flex-col overflow-hidden min-h-0">
          <ChatbotEmbed />
        </div>
      </div>
    </div>
  );
}