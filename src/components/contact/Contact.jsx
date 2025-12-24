import "./contact.css";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import ContactSvg from "./ContactSvg";

const listVariant = {
  initial: {
    x: 100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

// Spam detection keywords - financial/scam spam
const spamKeywords = [
  'viagra', 'casino', 'lottery', 'winner', 'prize', 'click here', 'free money',
  'nigerian prince', 'urgent', 'act now', 'limited time', 'guaranteed',
  'make money fast', 'work from home', 'get rich', 'bitcoin', 'crypto',
  'investment opportunity', 'loan', 'debt', 'credit card', 'pharmacy',
  'pills', 'weight loss', 'miracle'
];

// Vulgar and inappropriate content keywords
const vulgarKeywords = [
  'sex', 'sexual', 'sexy', 'fuck', 'fucking', 'shit', 'damn', 'bitch', 'ass',
  'asshole', 'bastard', 'porn', 'pornography', 'xxx', 'adult', 'dating',
  'hot singles', 'enlarge', 'penis', 'breast', 'nude', 'naked', 'orgasm',
  'masturbat', 'ejaculat', 'clitoris', 'vagina', 'dick', 'cock', 'pussy',
  'cum', 'sperm', 'erotic', 'lust', 'horny', 'aroused', 'kinky', 'fetish'
];

// Romantic/inappropriate personal content
const romanticKeywords = [
  'i love you', 'i love u', 'love you', 'love u', 'i like you', 'i like u',
  'marry me', 'marriage', 'relationship', 'dating', 'date me', 'go out',
  'beautiful', 'handsome', 'attractive', 'cute', 'hot', 'sexy', 'gorgeous',
  'want to have sex', 'have sex', 'sleep with', 'bed', 'kiss', 'hug',
  'romantic', 'romance', 'soulmate', 'boyfriend', 'girlfriend', 'wife', 'husband',
  'baby', 'honey', 'sweetheart', 'darling', 'babe', 'sugar', 'cutie',
  'miss you', 'miss u', 'thinking about you', 'dream about', 'fantasy',
  'intimate', 'intimacy', 'foreplay', 'make love', 'hookup', 'one night stand'
];

// Validate if message contains spam
const containsSpam = (text) => {
  const lowerText = text.toLowerCase();
  return spamKeywords.some(keyword => lowerText.includes(keyword));
};

// Validate if message contains vulgar content
const containsVulgar = (text) => {
  const lowerText = text.toLowerCase();
  return vulgarKeywords.some(keyword => lowerText.includes(keyword));
};

// Validate if message contains romantic/inappropriate personal content
const containsRomantic = (text) => {
  const lowerText = text.toLowerCase();
  // Check for exact phrases first (more specific)
  const romanticPhrases = [
    'i love you', 'i love u', 'love you', 'love u', 'i like you', 'i like u',
    'marry me', 'date me', 'go out', 'want to have sex', 'have sex',
    'sleep with', 'miss you', 'miss u', 'thinking about you', 'dream about',
    'make love', 'hookup', 'one night stand'
  ];
  
  if (romanticPhrases.some(phrase => lowerText.includes(phrase))) {
    return true;
  }
  
  // Check for individual romantic keywords
  return romanticKeywords.some(keyword => lowerText.includes(keyword));
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate message is work-related (contains professional keywords or is substantial)
const isWorkRelated = (message) => {
  const lowerMessage = message.toLowerCase();
  const workKeywords = [
    'project', 'work', 'job', 'hire', 'collaboration', 'collaborate',
    'business', 'service', 'consulting', 'freelance', 'opportunity',
    'portfolio', 'skills', 'experience', 'development', 'design',
    'website', 'application', 'software', 'client', 'proposal',
    'quote', 'estimate', 'discuss', 'meeting', 'interview', 'position',
    'role', 'company', 'organization', 'team', 'developer', 'programmer',
    'coding', 'code', 'build', 'create', 'develop', 'implement',
    'frontend', 'backend', 'full stack', 'ui/ux', 'ui', 'ux', 'react',
    'javascript', 'typescript', 'node', 'api', 'database', 'mobile app',
    'web app', 'application', 'system', 'platform', 'solution', 'requirement',
    'budget', 'timeline', 'deadline', 'deliverable', 'scope', 'feature',
    'functionality', 'technical', 'professional', 'career', 'employment'
  ];
  
  // Check word count
  const wordCount = message.trim().split(/\s+/).length;
  
  // Must contain work keywords (not just be long)
  const hasWorkKeywords = workKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // For shorter messages, require work keywords
  // For longer messages (30+ words), allow if substantial and doesn't contain romantic/vulgar content
  if (wordCount < 30) {
    return hasWorkKeywords;
  }
  
  // Longer messages need work keywords OR be clearly professional
  return hasWorkKeywords || (wordCount >= 30 && !containsRomantic(message) && !containsVulgar(message));
};

const Contact = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ref = useRef();
  const form = useRef();
  const honeypotRef = useRef(); // Honeypot field for spam detection

  // WhatsApp phone number (remove + and spaces for URL)
  const whatsappNumber = "916289688648"; // +91 6289688648

  const sendWhatsApp = (e) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);
    setErrorMessage("");

    // Get form values
    const formData = new FormData(form.current);
    const name = formData.get('user_username')?.trim() || '';
    const email = formData.get('user_email')?.trim() || '';
    const message = formData.get('user_message')?.trim() || '';
    const honeypot = formData.get('website') || ''; // Honeypot field

    // Validation checks
    if (!name || name.length < 2) {
      setError(true);
      setErrorMessage("Please enter a valid name (at least 2 characters).");
      return;
    }

    if (!email || !isValidEmail(email)) {
      setError(true);
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!message || message.length < 10) {
      setError(true);
      setErrorMessage("Please enter a message (at least 10 characters).");
      return;
    }

    // Honeypot check - if filled, it's likely a bot
    if (honeypot) {
      setError(true);
      setErrorMessage("Spam detected. Please try again.");
      return;
    }

    // Combine all text for checking
    const fullText = `${name} ${email} ${message}`.toLowerCase();

    // Check for vulgar content
    if (containsVulgar(fullText)) {
      setError(true);
      setErrorMessage("Your message contains inappropriate or vulgar content. Only work-related inquiries are accepted.");
      return;
    }

    // Check for romantic/inappropriate personal content
    if (containsRomantic(fullText)) {
      setError(true);
      setErrorMessage("This form is for work-related inquiries only. Personal or romantic messages are not accepted.");
      return;
    }

    // Spam keyword detection (financial/scam spam)
    if (containsSpam(fullText)) {
      setError(true);
      setErrorMessage("Your message contains spam content. Please send work-related inquiries only.");
      return;
    }

    // Work-related validation - must be work-related
    if (!isWorkRelated(message)) {
      setError(true);
      setErrorMessage("Please send work-related inquiries only. Include details about your project, collaboration request, or professional opportunity.");
      return;
    }

    setIsSubmitting(true);

    // Format the message for WhatsApp
    const whatsappMessage = `Hello! I'm ${name}.\n\nEmail: ${email}\n\nMessage:\n${message}`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab/window
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    setTimeout(() => {
      setSuccess(true);
      setError(false);
      setIsSubmitting(false);
      form.current.reset(); // Reset form after opening WhatsApp
    }, 500);
  };

  const isInView = useInView(ref, { margin: "-200px" });

  return (
    <div id="contact" className="contact" ref={ref}>
      <div className="cSection">
        <motion.form
          ref={form}
          variants={listVariant}
          animate={isInView ? "animate" : "initial"}
          onSubmit={sendWhatsApp}
        >
          <motion.h1 variants={listVariant} className="cTitle">
            Let's keep in touch
          </motion.h1>
          <motion.div variants={listVariant} className="formItem">
            <label>Name *</label>
            <input 
              type="text" 
              name="user_username" 
              placeholder="Your Name" 
              required
              minLength={2}
            />
          </motion.div>
          <motion.div variants={listVariant} className="formItem">
            <label>Email *</label>
            <input
              type="email"
              name="user_email"
              placeholder="your.email@gmail.com"
              required
            />
          </motion.div>
          <motion.div variants={listVariant} className="formItem">
            <label>Message *</label>
            <textarea
              rows={10}
              name="user_message"
              placeholder="Please describe your project, collaboration request, or work-related inquiry..."
              required
              minLength={10}
            ></textarea>
          </motion.div>
          {/* Honeypot field - hidden from users, bots will fill it */}
          <input
            type="text"
            name="website"
            ref={honeypotRef}
            style={{ display: 'none' }}
            tabIndex="-1"
            autoComplete="off"
          />
          <motion.button 
            variants={listVariant} 
            className="formButton"
            type="submit"
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting ? 'Opening WhatsApp...' : 'Send via WhatsApp'}
          </motion.button>
          {success && (
            <span style={{ color: '#4caf50', marginTop: '10px', display: 'block' }}>
              ✓ WhatsApp is opening with your message! Please send it to complete your inquiry.
            </span>
          )}
          {error && (
            <span style={{ color: '#f44336', marginTop: '10px', display: 'block' }}>
              {errorMessage || 'Something went wrong! Please try again.'}
            </span>
          )}
        </motion.form>
      </div>
      <div className="cSection">
        <motion.div
          variants={listVariant}
          animate={isInView ? "animate" : "initial"}
          style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}
        >
          <motion.h2 variants={listVariant} style={{ marginBottom: "20px" }}>
            Contact Information
          </motion.h2>
          <motion.div variants={listVariant}>
            <strong>Email:</strong>{" "}
            <a href="mailto:amipranjalikundu@gmail.com" style={{ color: "inherit" }}>
              amipranjalikundu@gmail.com
            </a>
          </motion.div>
          <motion.div variants={listVariant}>
            <strong>Phone:</strong>{" "}
            <a href="tel:+916289688648" style={{ color: "inherit" }}>
              +91 6289688648
            </a>
          </motion.div>
          <motion.div variants={listVariant}>
            <strong>WhatsApp:</strong>{" "}
            <a 
              href={`https://wa.me/${whatsappNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              +91 6289688648
            </a>
          </motion.div>
          <motion.div variants={listVariant}>
            <strong>Location:</strong> Laketown, Kolkata
          </motion.div>
        </motion.div>
        <ContactSvg/>
      </div>
    </div>
  );
};

export default Contact;
