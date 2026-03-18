import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/** Contact page with a simple dummy-submit form */
const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="container mx-auto px-6 py-20 text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h1>
        <p className="text-muted-foreground">Thanks for reaching out. We'll get back to you soon (demo only).</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20 flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Get in Touch</h1>
          <p className="text-sm text-muted-foreground mt-1">We'd love to hear from you.</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <Input placeholder="Your Name" className="rounded-lg" />
          <Input type="email" placeholder="Your Email" className="rounded-lg" />
          <Textarea placeholder="Your Message" className="rounded-lg min-h-[120px]" />
          <Button type="submit" className="w-full rounded-lg" size="lg">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
