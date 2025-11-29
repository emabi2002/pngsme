'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { OrderItem } from '@/lib/types';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  verified_purchase: boolean;
  reviewer: {
    full_name: string;
  };
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function ProductReviews({
  productId,
  reviews: initialReviews,
  averageRating,
  totalReviews,
}: ProductReviewsProps) {
  const [reviews] = useState(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitReview = async () => {
    setError('');
    setSubmitting(true);

    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to leave a review');
        return;
      }

      // Check if user has purchased this product
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          items:order_items(product_id)
        `)
        .eq('buyer_user_id', user.id)
        .eq('status', 'delivered');

      interface OrderWithItems {
        id: string;
        items?: { product_id: string }[];
      }

      const hasPurchased = orders?.some((order: OrderWithItems) =>
        order.items?.some((item: { product_id: string }) => item.product_id === productId)
      );

      if (!hasPurchased) {
        setError('You can only review products you have purchased');
        return;
      }

      // Submit review
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          target_product_id: productId,
          reviewer_user_id: user.id,
          rating,
          comment,
          verified_purchase: true,
          status: 'pending', // Requires admin approval
        });

      if (reviewError) throw reviewError;

      setShowReviewForm(false);
      setComment('');
      setRating(5);
      alert('Thank you! Your review has been submitted and is awaiting approval.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number, filled: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < filled ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const renderInteractiveStars = (selected: number, onSelect: (rating: number) => void) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onSelect(i + 1)}
        className="hover:scale-110 transition-transform"
      >
        <Star
          className={`h-6 w-6 ${
            i < selected ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
          }`}
        />
      </button>
    ));
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Customer Reviews</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {renderStars(5, Math.round(averageRating))}
              </div>
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({totalReviews} reviews)</span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Write a Review
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Review Form */}
        {showReviewForm && (
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Write Your Review</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Your Rating</label>
              <div className="flex gap-1">
                {renderInteractiveStars(rating, setRating)}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Your Review</label>
              <textarea
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitReview} disabled={submitting || !comment}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false);
                  setError('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <Separator />

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-3">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                      {getUserInitials(review.reviewer.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{review.reviewer.full_name}</span>
                      {review.verified_purchase && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-0.5">
                        {renderStars(5, review.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
