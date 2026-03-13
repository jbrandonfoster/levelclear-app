'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar } from '@/components/Avatar';
import { HeartIcon, MessageIcon } from '@/components/Icons';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  userDay: number;
  isCreator: boolean;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  userDay: number;
  isCreator: boolean;
  content: string;
  likes: number;
  likedByNames: string[];
  isLikedByMe: boolean;
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

  // Comment state
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set());
  const [postingComment, setPostingComment] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/community');
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
          // Initialize liked posts from server data
          const liked = new Set<string>();
          data.forEach((post: Post) => {
            if (post.isLikedByMe) {
              liked.add(post.id);
            }
          });
          setLikedPosts(liked);
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
        newPost.likedByNames = [];
        newPost.isLikedByMe = false;
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
        const myName = session.user?.name || 'You';

        if (liked) {
          newLiked.add(postId);
        } else {
          newLiked.delete(postId);
        }

        setLikedPosts(newLiked);

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likes: p.likes + (liked ? 1 : -1),
                  likedByNames: liked
                    ? [...p.likedByNames, myName]
                    : p.likedByNames.filter((n) => n !== myName),
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const toggleComments = async (postId: string) => {
    const newExpanded = new Set(expandedComments);

    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
      setExpandedComments(newExpanded);
      return;
    }

    newExpanded.add(postId);
    setExpandedComments(newExpanded);

    // Fetch comments if we haven't already
    if (!postComments[postId]) {
      const newLoading = new Set(loadingComments);
      newLoading.add(postId);
      setLoadingComments(newLoading);

      try {
        const res = await fetch(`/api/community/${postId}/comments`);
        if (res.ok) {
          const comments = await res.json();
          setPostComments((prev) => ({ ...prev, [postId]: comments }));
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        const doneLoading = new Set(loadingComments);
        doneLoading.delete(postId);
        setLoadingComments(doneLoading);
      }
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!session?.user?.id || !content) return;

    const newPosting = new Set(postingComment);
    newPosting.add(postId);
    setPostingComment(newPosting);

    try {
      const res = await fetch(`/api/community/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setPostComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment],
        }));
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));

        // Update comment count
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, comments: p.comments + 1 } : p
          )
        );
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      const donePosting = new Set(postingComment);
      donePosting.delete(postId);
      setPostingComment(donePosting);
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

              {/* Liked By */}
              {post.likedByNames && post.likedByNames.length > 0 && (
                <p className="text-xs text-gray-500 mb-3">
                  Liked by{' '}
                  <span className="text-gray-400">
                    {post.likedByNames.length <= 2
                      ? post.likedByNames.join(' and ')
                      : `${post.likedByNames.slice(0, 2).join(', ')} and ${post.likedByNames.length - 2} other${post.likedByNames.length - 2 > 1 ? 's' : ''}`}
                  </span>
                </p>
              )}

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
                <button
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    expandedComments.has(post.id)
                      ? 'text-accent-gold'
                      : 'text-gray-400 hover:text-accent-gold'
                  }`}
                >
                  <MessageIcon className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments.has(post.id) && (
                <div className="mt-4 pt-4 border-t border-dark-border">
                  {/* Existing Comments */}
                  {loadingComments.has(post.id) ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">Loading comments...</p>
                    </div>
                  ) : (
                    <>
                      {postComments[post.id] && postComments[post.id].length > 0 ? (
                        <div className="space-y-3 mb-4">
                          {postComments[post.id].map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar name={comment.userName} size="sm" dayNumber={comment.userDay} />
                              <div className="flex-1 bg-dark-bg rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold">{comment.userName}</span>
                                  {comment.isCreator && (
                                    <span className="text-[10px] bg-accent-gold text-dark-bg px-1.5 py-0.5 rounded font-semibold">
                                      Creator
                                    </span>
                                  )}
                                  <span className="text-[11px] text-gray-600">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="text-sm text-gray-300">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm mb-4">No comments yet. Be the first.</p>
                      )}
                    </>
                  )}

                  {/* Comment Input */}
                  {session && (
                    <div className="flex gap-3">
                      <Avatar name={session.user?.name || 'You'} size="sm" />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleCommentSubmit(post.id);
                            }
                          }}
                          placeholder="Write a comment..."
                          maxLength={300}
                          className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          disabled={postingComment.has(post.id) || !commentInputs[post.id]?.trim()}
                          className="px-4 py-2 bg-accent-gold text-dark-bg text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors"
                        >
                          {postingComment.has(post.id) ? '...' : 'Post'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
