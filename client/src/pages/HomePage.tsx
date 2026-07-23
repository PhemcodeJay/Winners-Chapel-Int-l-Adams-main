import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Church, 
  Calendar, 
  Users, 
  Heart, 
  Mail, 
  MapPin, 
  Phone,
  LogIn,
  Play,
  Image as ImageIcon,
  Video,
  Send,
  DollarSign,
  BookOpen,
  Music
} from "lucide-react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [prayerName, setPrayerName] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing! We'll keep you updated.");
    setEmail("");
  };

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Your prayer request has been submitted. We will pray for you.");
    setPrayerName("");
    setPrayerRequest("");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for reaching out. We will get back to you soon.");
    setContactName("");
    setContactEmail("");
    setContactMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
            <img src="/wcia-logo.svg" alt="Winners Chapel International Adams Logo" className="w-full h-full p-3 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Winners Chapel International Adams</h1>
          <p className="text-xl text-muted-foreground mb-8">Worship • Word • Witness</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Welcome to a place where faith comes alive. Join us as we worship, grow, and impact our community together.
          </p>
          <Link href="/auth">
            <Button size="lg" className="text-lg px-8 py-6">
              <LogIn className="mr-2 h-5 w-5" />
              Admin Login
            </Button>
          </Link>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Service Times</h2>
            <p className="text-lg text-muted-foreground">Join us for powerful services every week</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">First Service</CardTitle>
                <CardDescription className="text-lg">Morning Glory</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary mb-2">8:00 AM - 10:00 AM</p>
                <p className="text-muted-foreground">Adams, Nairobi</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Second Service</CardTitle>
                <CardDescription className="text-lg">Faith Clinic</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary mb-2">10:00 AM - 12:00 PM</p>
                <p className="text-muted-foreground">Adams, Nairobi</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">About Us</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Winners Chapel International Adams is a vibrant community of believers dedicated to worship, 
              teaching the Word, and reaching our world with the gospel of Jesus Christ.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Word</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Teaching the uncompromised Word of God for transformation and empowerment.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Church className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Worship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Creating an atmosphere for meaningful encounters with God through worship.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Witness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Impacting our world through outreach, evangelism, and community service.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Events & Announcements */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Events & Announcements</h2>
            <p className="text-lg text-muted-foreground">Stay updated with what's happening in our church</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="h-5 w-5" />
                  <CardTitle className="text-lg">Sunday Service</CardTitle>
                </div>
                <CardDescription>Every Sunday</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Join us for powerful worship and the undiluted Word of God.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Heart className="h-5 w-5" />
                  <CardTitle className="text-lg">Midweek Service</CardTitle>
                </div>
                <CardDescription>Wednesdays</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Midweek prayer and Bible study for spiritual growth.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Users className="h-5 w-5" />
                  <CardTitle className="text-lg">Youth Fellowship</CardTitle>
                </div>
                <CardDescription>Saturdays</CardDescription>
              </CardHeader>
              <CardContent>
                <p>A vibrant community for young people to grow in faith.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media Feeds */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Connect With Us</h2>
            <p className="text-lg text-muted-foreground">Follow us on social media for updates and inspiration</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Facebook</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="https://www.facebook.com/p/Wci-Adams-Winners-Chapel-International-Adams-100080393651416/" target="_blank" rel="noopener noreferrer" className="block">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors">
                    <div className="text-center p-4">
                      <Video className="h-12 w-12 mx-auto mb-2 text-primary" />
                      <p className="text-sm">View our Facebook page</p>
                    </div>
                  </div>
                </a>
                <div className="mt-4">
                  <a href="https://www.facebook.com/p/Wci-Adams-Winners-Chapel-International-Adams-100080393651416/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      Visit Facebook Page
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Instagram</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="https://www.instagram.com/winnersadams/" target="_blank" rel="noopener noreferrer" className="block">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors">
                    <div className="text-center p-4">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 text-primary" />
                      <p className="text-sm">View our Instagram feed</p>
                    </div>
                  </div>
                </a>
                <div className="mt-4">
                  <a href="https://www.instagram.com/winnersadams/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      Visit Instagram Page
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>YouTube</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="https://www.youtube.com/channel/UCYC2AgLeU1vvE-JhlStW-JA" target="_blank" rel="noopener noreferrer" className="block">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors">
                    <div className="text-center p-4">
                      <Play className="h-12 w-12 mx-auto mb-2 text-primary" />
                      <p className="text-sm">Watch our sermons</p>
                    </div>
                  </div>
                </a>
                <div className="mt-4">
                  <a href="https://www.youtube.com/channel/UCYC2AgLeU1vvE-JhlStW-JA" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      Visit YouTube Channel
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sermon/Media Gallery */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Sermon Gallery</h2>
            <p className="text-lg text-muted-foreground">Watch and listen to recent messages</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Play className="h-16 w-16 text-primary/50" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Sermon {item}</CardTitle>
                  <CardDescription>Add sermon title and date</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">More sermons available on our YouTube channel</p>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Photo Gallery</h2>
            <p className="text-lg text-muted-foreground">Moments from our church community</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="aspect-square bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors">
                <ImageIcon className="h-12 w-12 text-primary/30" />
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Add your church photos to showcase your community
          </p>
        </div>
      </section>

      {/* Live Stream */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Live Stream</h2>
            <p className="text-lg text-muted-foreground">Join us online from anywhere in the world</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-20 w-20 mx-auto mb-4 text-primary/50" />
                  <p className="text-lg font-medium">Live stream will appear here</p>
                  <p className="text-sm text-muted-foreground mt-2">Add your YouTube Live stream URL</p>
                </div>
              </div>
              <div className="text-center mt-4">
                <a href="https://www.youtube.com/channel/UCYC2AgLeU1vvE-JhlStW-JA" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <Play className="mr-2 h-4 w-4" />
                    Watch on YouTube
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Giving/Donations */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Giving & Donations</h2>
            <p className="text-lg text-muted-foreground">Support the ministry and make an impact</p>
          </div>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Give Online</CardTitle>
              <CardDescription>Your generous giving helps us Reach, Teach, and Touch lives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Bank Transfer Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Bank:</strong> [Add Bank Name]</p>
                    <p><strong>Account Name:</strong> Winners Chapel International Adams</p>
                    <p><strong>Account Number:</strong> [Add Account Number]</p>
                    <p><strong>Branch:</strong> [Add Branch]</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">M-Pesa Paybill</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Paybill:</strong> [Add Paybill Number]</p>
                    <p><strong>Account:</strong> [Add Account Number]</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  Thank you for your partnership in the gospel. May the Lord bless your generous giving.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Prayer Request Form */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Prayer Request</h2>
            <p className="text-lg text-muted-foreground">We believe in the power of prayer. Share your prayer request with us.</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handlePrayerSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <Input 
                    placeholder="Enter your name" 
                    value={prayerName}
                    onChange={(e) => setPrayerName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prayer Request</label>
                  <Textarea 
                    placeholder="Share your prayer request..." 
                    rows={5}
                    value={prayerRequest}
                    onChange={(e) => setPrayerRequest(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Prayer Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Stay Connected</h2>
          <p className="text-lg text-muted-foreground mb-8">Subscribe to our newsletter for updates and inspiration</p>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" size="lg">
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form & Location */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Contact Us</h2>
            <p className="text-lg text-muted-foreground">We would love to hear from you</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input 
                      placeholder="Your name" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input 
                      type="email" 
                      placeholder="your.email@example.com" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      placeholder="How can we help you?" 
                      rows={5}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Visit Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">Adams, Nairobi, Kenya</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">[Add phone number]</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">[Add email address]</p>
                  </div>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-primary/50" />
                    <p className="text-sm text-muted-foreground">Map embed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-display font-bold text-xl mb-4">Winners Chapel International Adams</h3>
              <p className="text-primary-foreground/80">Worship • Word • Witness</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link href="/auth" className="hover:text-primary-foreground">Admin Login</Link></li>
                <li><a href="#service-times" className="hover:text-primary-foreground">Service Times</a></li>
                <li><a href="#about" className="hover:text-primary-foreground">About Us</a></li>
                <li><a href="#contact" className="hover:text-primary-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="space-y-2">
                <a href="https://www.facebook.com/p/Wci-Adams-Winners-Chapel-International-Adams-100080393651416/" target="_blank" rel="noopener noreferrer" className="block text-primary-foreground/80 hover:text-primary-foreground">Facebook</a>
                <a href="https://www.instagram.com/winnersadams/" target="_blank" rel="noopener noreferrer" className="block text-primary-foreground/80 hover:text-primary-foreground">Instagram</a>
                <a href="https://www.youtube.com/channel/UCYC2AgLeU1vvE-JhlStW-JA" target="_blank" rel="noopener noreferrer" className="block text-primary-foreground/80 hover:text-primary-foreground">YouTube</a>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
            <p>&copy; {new Date().getFullYear()} Winners Chapel International Adams. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}