import { ChatbotEmbed } from '@/app/components/ChatbotEmbed';

export default function AIAssistant() {
  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='max-w-4xl w-full'>
        <div className='text-center mb-8'>
          <h1 className="font-bold text-4xl mb-2">
            AI Fitness <span className="text-blue-500">Assistant</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Get personalized workout advice, nutrition tips, and fitness guidance
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 h-[700px] flex flex-col overflow-hidden">
          <ChatbotEmbed />
        </div>
      </div>
    </div>
  );
}
