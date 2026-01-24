import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

/* ===============================
   Validation Schema
================================ */
const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must be less than 100 characters' }),

  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),

  projectType: z.enum(
    ['branding', 'print', 'social-media', 'ai', 'packaging', 'merchandise', 'others'],
    { required_error: 'Please select a project type' }
  ),

  message: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(1000, { message: 'Message must be less than 1000 characters' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

/* ===============================
   Component
================================ */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      projectType: undefined,
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: data.name,
          email: data.email,
          project_type: data.projectType,
          message: data.message,
        });

      if (error) throw error;

      setIsSuccess(true);
      form.reset();

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      form.setError('root', {
        message: 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     Success State
  ================================ */
  if (isSuccess) {
    return (
      <motion.div
        className="bg-accent border border-border rounded-sm p-8 text-center space-y-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle2 className="size-16 mx-auto text-green-600 dark:text-green-400" />
        </motion.div>
        <h3 className="text-2xl font-light tracking-wide">Message Sent!</h3>
        <p className="text-muted-foreground font-light leading-relaxed">
          Thank you for reaching out. I'll get back to you as soon as possible.
        </p>
      </motion.div>
    );
  }

  /* ===============================
     Form
  ================================ */
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Project Type */}
        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="branding">Branding</SelectItem>
                  <SelectItem value="print">Print</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                  <SelectItem value="merchandise">Merchandise</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me about your project..."
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Root Error */}
        {form.formState.errors.root && (
          <div className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Submit */}
        <Button type="submit" className="w-full py-6" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </Button>
      </form>
    </Form>
  );
}
