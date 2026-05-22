'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ShieldCheck, PenTool } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

export interface ReviewItem {
  _id: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
  initialReviews?: ReviewItem[];
  averageRating: number;
  reviewCount: number;
}

export default function ReviewSection({
  productId,
  initialReviews = [],
  averageRating = 0,
  reviewCount = 0
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [ratingInput, setRatingInput] = useState(5);
  const [titleInput, setTitleInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // In production, we'd fetch reviews for this product from the database
    // For local simulation, we seed from props
    setReviews(initialReviews.length > 0 ? initialReviews : [
      {
        _id: 'rev1',
        userName: 'Alistair C.',
        rating: 5,
        title: 'An absolute masterpiece of distilling',
        comment: 'Extraordinary depth of flavor. The wheated mash bill delivers a smooth texture that lingeringly finishes with notes of dark spice and leather. Essential collector bottle.',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'rev2',
        userName: 'Evelyn M.',
        rating: 4,
        title: 'Exceptional smoothness and nose',
        comment: 'A magnificent whiskey. Butterscotch and rich oak aromas fill the room upon opening. A little pricey, but worth every single penny for a special occasion.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  }, [initialReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!commentInput) {
      alert('Please fill out the review comment.');
      return;
    }

    setSubmitting(true);

    try {
      // Simulate API post delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newReview: ReviewItem = {
        _id: Math.random().toString(),
        userName: 'Verified Connoisseur',
        rating: ratingInput,
        title: titleInput || 'Highly Recommended',
        comment: commentInput,
        createdAt: new Date().toISOString()
      };

      setReviews([newReview, ...reviews]);
      setSuccessMsg('Your editorial review has been submitted successfully and is awaiting concierge moderation.');
      setTitleInput('');
      setCommentInput('');
      setRatingInput(5);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-border/80 pt-16 mt-16 max-w-5xl mx-auto">
      <h2 className="text-xl md:text-2xl text-editorial tracking-wide text-foreground mb-8">
        Connoisseur Reviews
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Rating Analytics Column */}
        <div className="space-y-6">
          <div className="luxury-glass p-6 text-center space-y-4">
            <div className="text-4xl font-semibold tracking-wider text-primary font-sans">
              {averageRating || 4.9}
            </div>
            
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating || 5) 
                      ? 'fill-primary text-primary' 
                      : 'text-muted-foreground/30'
                  }`} 
                />
              ))}
            </div>

            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Based on {reviewCount || reviews.length} certified reviews
            </div>
          </div>

          {/* Luxury rating distribution bar chart */}
          <div className="space-y-3">
            {[
              { stars: 5, pct: '85%' },
              { stars: 4, pct: '12%' },
              { stars: 3, pct: '3%' },
              { stars: 2, pct: '0%' },
              { stars: 1, pct: '0%' }
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="w-12">{row.stars} Stars</span>
                <div className="flex-grow h-1.5 bg-muted rounded-none overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: row.pct }} />
                </div>
                <span className="w-8 text-right font-semibold text-foreground">{row.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review List Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Post a Review Form */}
          <div className="bg-muted/40 border border-border/60 p-6 rounded-none space-y-4">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-foreground flex items-center gap-2">
              <PenTool className="h-4 w-4 text-primary" />
              Write an Editorial Review
            </h3>

            <SignedIn>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Stars input */}
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">
                    Rating Selection
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="cursor-pointer text-primary"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= (hoverRating !== null ? hoverRating : ratingInput)
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground/30'
                          } duration-150`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">
                    Review Summary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Masterful expression, Exceptional vintages"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="w-full bg-muted border border-border/80 text-[12px] py-3 px-4 rounded-none text-foreground placeholder:text-muted-foreground/30"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">
                    Detailed Impression
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your tasting notes, oak profile, mouthfeel, or collector experience..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="w-full bg-muted border border-border/80 text-[12px] py-3 px-4 rounded-none text-foreground placeholder:text-muted-foreground/30"
                    required
                  />
                </div>

                {successMsg && (
                  <div className="text-[11px] uppercase tracking-widest text-green-400 bg-green-950/20 border border-green-500/10 p-3">
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-accent text-background text-[9px] font-semibold uppercase tracking-[0.3em] py-3 px-6 rounded-none duration-300 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Concierge Review'}
                </button>
              </form>
            </SignedIn>

            <SignedOut>
              <div className="p-4 border border-dashed border-border text-center space-y-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Only verified collectors can post tasting reviews.
                </p>
                <SignInButton mode="modal">
                  <button className="bg-primary/10 hover:bg-primary/20 text-primary text-[9px] uppercase tracking-[0.25em] font-semibold py-2.5 px-5 duration-300 cursor-pointer">
                    Sign In to Review
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>

          {/* List display */}
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev._id} className="border-b border-border/60 pb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-foreground">{rev.userName}</span>
                    <div className="bg-primary/10 text-primary text-[7px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 flex items-center gap-1 border border-primary/20">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      Verified Collector
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground tracking-wider font-mono">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-3 w-3 ${
                        star <= rev.rating 
                          ? 'fill-primary text-primary' 
                          : 'text-muted-foreground/30'
                      }`} 
                    />
                  ))}
                </div>

                {rev.title && (
                  <h4 className="text-[12px] tracking-wide font-medium uppercase text-foreground">
                    {rev.title}
                  </h4>
                )}

                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
