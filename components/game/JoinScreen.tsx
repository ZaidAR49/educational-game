import { Loader2 } from "lucide-react";

type JoinScreenProps = {
  game: any;
  playerName: string;
  setPlayerName: (name: string) => void;
  isPending: boolean;
  onJoin: (e: React.FormEvent) => void;
  onGenerateRandomName: () => void;
};

export function JoinScreen({
  game,
  playerName,
  setPlayerName,
  isPending,
  onJoin,
  onGenerateRandomName
}: JoinScreenProps) {
  return (
    <form onSubmit={onJoin} className="bg-white rounded-3xl p-8 shadow-xl text-center animate-in fade-in duration-500">
       <div className={`w-20 h-20 ${game.organization?.logoPath ? 'bg-transparent' : 'bg-indigo-50'} rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 text-4xl overflow-hidden`}>
         {game.organization?.logoPath ? (
           <img src={game.organization.logoPath} alt="Logo" className="w-full h-full object-contain" />
         ) : (
           "🎮"
         )}
       </div>
       <h1 className="text-3xl font-black text-gray-900 mb-2">
         الانضمام للعبة
       </h1>
       <p className="text-gray-500 font-bold mb-8">{game.title}</p>
       
       <div className="mb-6 text-right">
         <label className="block text-gray-700 font-bold mb-2">اسمك الأول</label>
         <div className="relative">
           <input 
             type="text" 
             required
             value={playerName}
             onChange={(e) => setPlayerName(e.target.value)}
             className="w-full pl-16 pr-5 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-bold"
             placeholder="اكتب اسمك هنا..."
             autoFocus
           />
           <button
             type="button"
             onClick={onGenerateRandomName}
             className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors group"
             title="توليد اسم عشوائي"
           >
             <span className="text-xl group-hover:rotate-180 inline-block transition-transform duration-300">🎲</span>
           </button>
         </div>
       </div>

       <button
         type="submit"
         disabled={isPending || !playerName.trim()}
         className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-lg font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
       >
         {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "دخول الآن"}
       </button>
    </form>
  );
}
