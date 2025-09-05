import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { ChefHat, Code2, Users, MessageCircle, Heart, Coffee, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen py-12 sm:py-16">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-hero">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px]" />
        <div className="relative container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <img
                  src={siteConfig.author.photo}
                  alt={siteConfig.author.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-warm"
                />
                <div className="absolute -bottom-2 -right-2 p-2 bg-accent rounded-full shadow-glow">
                  <Sparkles className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-4xl sm:text-5xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                Let's Connect
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Love what you see? Have a recipe to share or a tech question? 
                I'd love to hear from you and connect with fellow food and tech enthusiasts.
              </p>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-4 gap-6 max-w-xs mx-auto pt-8">
              <a 
                href={siteConfig.author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center group transition-transform hover:scale-110"
              >
                <div className="text-3xl mb-2">💼</div>
                <div className="text-xs text-muted-foreground group-hover:text-accent transition-colors">LinkedIn</div>
              </a>
              <a 
                href={siteConfig.author.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center group transition-transform hover:scale-110"
              >
                <div className="text-3xl mb-2">🐙</div>
                <div className="text-xs text-muted-foreground group-hover:text-accent transition-colors">GitHub</div>
              </a>
              <a 
                href={siteConfig.author.social.techInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center group transition-transform hover:scale-110"
              >
                <div className="text-3xl mb-2">💻</div>
                <div className="text-xs text-muted-foreground group-hover:text-tech transition-colors">Tech IG</div>
              </a>
              <a 
                href={siteConfig.author.social.cookInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center group transition-transform hover:scale-110"
              >
                <div className="text-3xl mb-2">👨‍🍳</div>
                <div className="text-xs text-muted-foreground group-hover:text-recipe transition-colors">Cook IG</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* What I Do */}
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="card-hover">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-recipe/10 rounded-lg">
                    <ChefHat className="h-8 w-8 text-recipe" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">Cooking Enthusiast</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Let me put it out there that I am by no means a chef. But I love experimenting with new things! It all started with me helping out my mother in the kitchen.
                  Overtime, I grew this ambition to film and edit my own videos. I struggled with what content I should put out.
                  Eventually, I decided to combine my passion into my daily routine. And bon appetite! You get wfhubby!
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-recipe border-recipe/50">Home Cook</Badge>
                  <Badge variant="outline" className="text-recipe border-recipe/50">Baking</Badge>
                  <Badge variant="outline" className="text-recipe border-recipe/50">Healthy Meal Preps</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-tech/10 rounded-lg">
                    <Code2 className="h-8 w-8 text-tech" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">Tech Developer</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Fun fact: I graduated Singapore Polytechnic with a diploma in Aerospace Electronics.
                  I struggled to find a job in the aerospace industry, so I pivoted to software development.
                  I am currently an NTU computer science undergraduate. I love building cool projects and learning about new tech.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-tech border-tech/50">Fullstack</Badge>
                  <Badge variant="outline" className="text-tech border-tech/50">Multimodal AI</Badge>
                  <Badge variant="outline" className="text-tech border-tech/50">ML</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Journey */}
          <Card className="card-hover">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-display text-2xl font-semibold">My Journey</h3>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  I grew up in the Middle East, and from a young age, I watched my mother adapting to a new culture while being a house wife and mother to 5 children.
                  It was always a joy to come home to eat her home-cooked meals. And I learned from watching her cook and helping her out.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  At a young age, I loved to create videos and tell stories. However, as I grew older, I was advised by my father to pursue a more "practical" career.
                  Hence, I focused on my studies and eventually ended up in NTU computer science.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  It was difficult. I had perfomance anxiety and imposter syndrome. Going into a completely different career path, and fresh from National Service.
                  My first year in University was not as smooth sailing as I hoped. But Alhamdullilah, I managed to pull through thanks to my amazing support from family, friends and you!

                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fun Facts */}
          <Card className="card-hover">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Coffee className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold">Fun Facts</h3>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">☕ Coffee Ritual</h4>
                  <p className="text-sm text-muted-foreground">
                    I need coffee to start my day, I get migraines without it.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">🌱 Life long learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Inspired by my parents, I found my passion for mentoring, I eventually became a weekend teacher in my neighbourhood mosque.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">📚 Reading</h4>
                  <p className="text-sm text-muted-foreground">
                    I love reading books. My favourite back in secondary was the percy jackson series.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">🎵 Coding Soundtrack</h4>
                  <p className="text-sm text-muted-foreground">
                    Not really fan of music, I prefer coding in white noise. But I'm open to suggestions!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connect */}
          <div className="text-center space-y-6">
            <div className="space-y-3">
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-recipe text-recipe-foreground hover:shadow-glow transition-all"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                "At the end of the day, Allah knows your intentions and that's all that matters"
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}