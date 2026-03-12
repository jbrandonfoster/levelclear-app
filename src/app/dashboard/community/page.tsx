'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar } from '@/components/Avatar';
import { HeartIcon, MessageIcon } from '@/components/Icons';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  userDay: number;
  isCreator: boolean;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export default function CommunityPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/community');
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id || !newPostContent.trim()) return;

    setIsPosting(true);
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent }),
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]);
        setNewPostContent('');
      }
    } catch (error) {
      console.error('Failed to post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(`/api/community/${postId}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        const { liked } = await res.json();
        const newLiked = new Set(likedPosts);

        if (liked) {
          newLiked.add(postId);
        } else {
          newLiked.delete(postId);
        }

        setLikedPosts(newLiked);

        // Update post likes count
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, likes: p.likes + (liked ? 1 : -1) }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Community</h1>
        <p className="text-gray-300">
          Real people, real stories, same journey.
        </p>
      </div>

      {/* New Post Composer */}
      {session && (
        <form onSubmit={handlePostSubmit} className="mb-8">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <div className="flex gap-4 mb-4">
              <Avatar name={session.user?.name || 'You'} size="md" />
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share what's on your mind..."
                maxLength={500}
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg p-4 text-white placeholder-gray-600 resize-none focus:outline-none focus:border-accent-gold"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {newPostContent.length}/500
              </div>
              <button
                type="submit"
                disabled={isPosting || !newPostContent.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPosting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Posts Feed */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-dark-card border border-dark-border rounded-lg">
          <p className="text-gray-400 mb-2">No posts yet.</p>
          <p className="text-gray-500 text-sm">
            Be the first to share your story.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-dark-card border border-dark-border rounded-lg p-6"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={post.userName} size="md" dayNumber={post.userDay} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{post.userName}</p>
                      {post.isCreator && (
                        <span className="text-xs bg-accent-gold text-dark-bg px-2 py-1 rounded font-semibold">
                          Creator
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-300 mb-4 leading-relaxed">
                {post.content}
              </p>

              {/* Post Footer */}
              <div className="flex items-center gap-6 pt-4 border-t border-dark-border">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    likedPosts.has(post.id)
                      ? 'text-accent-gold'
                      : 'text-gray-400 hover:text-accent-gold'
                  }`}
                >
                  <HeartIcon className="w-5 h-5" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-accent-gold transition-colors">
                  <MessageIcon className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
