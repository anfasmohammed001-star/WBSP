import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, MessageCircle, Share2, ThumbsUp } from 'lucide-react';

export default function Community() {
    const navigate = useNavigate();

    const posts = [
        {
            id: 1,
            user: 'Sarah Jenkins',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
            time: '2h ago',
            content: 'Just had my living room painted by Alex C. Amazing work! The "Summer Refresh" bundle was totally worth it.',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
            likes: 42,
            comments: 5
        },
        {
            id: 2,
            user: 'Mike T.',
            avatar: 'https://i.pravatar.cc/150?u=mike',
            time: '5h ago',
            content: 'Pro Tip: Before the plumber arrives, clear out the cabinet under the sink. Saves them time and you money! 💡',
            likes: 128,
            comments: 14
        },
        {
            id: 3,
            user: 'Emily R.',
            avatar: 'https://i.pravatar.cc/150?u=emily',
            time: '1d ago',
            content: 'Anyone used the new AR feature? It helped me figure out if that lamp would fit. Super cool tech!',
            image: 'https://images.unsplash.com/photo-1534349762913-96c22559779c?auto=format&fit=crop&w=600&q=80',
            likes: 89,
            comments: 23
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-full">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-black">Community Hub</h1>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-bold">
                    + New Post
                </button>
            </div>

            <div className="p-4 space-y-6">
                {posts.map((post) => (
                    <div key={post.id} className="bg-card border border-border rounded-3xl p-5 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full" />
                            <div>
                                <h3 className="font-bold text-sm">{post.user}</h3>
                                <p className="text-xs text-muted-foreground">{post.time}</p>
                            </div>
                        </div>

                        <p className="text-sm mb-4 leading-relaxed">{post.content}</p>

                        {post.image && (
                            <div className="rounded-2xl overflow-hidden mb-4">
                                <img src={post.image} alt="Post content" className="w-full object-cover max-h-64" />
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <button className="flex items-center space-x-1 text-muted-foreground hover:text-red-500 transition-colors">
                                <Heart className="h-5 w-5" />
                                <span className="text-xs font-bold">{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 transition-colors">
                                <MessageCircle className="h-5 w-5" />
                                <span className="text-xs font-bold">{post.comments}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-muted-foreground hover:text-green-500 transition-colors">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
