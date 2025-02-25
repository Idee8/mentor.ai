"use client";
const testimonials = [
  {
    name: "Alex Carter",
    username: "alexdev",
    avatar: "/avatars/avatar-3.jpg",
    text: [
      "Mentor AI has completely changed the way I learn to code. It provides clear explanations, real-time feedback, and even suggests best practices tailored to my coding style.",
      "I used to spend hours searching Stack Overflow, but now I get instant, AI-powered insights that help me write cleaner, more efficient code.",
    ],
  },
  {
    name: "Daniel Kim",
    username: "danielk_dev",
    avatar: "/avatars/avatar-7.jpg",
    text: [
      "Mentor AI is the perfect coding companion. It not only helps me fix bugs but also explains concepts in a way that makes them easy to understand.",
      "My productivity has skyrocketed since using it—no more endless Googling for solutions. It’s like having a senior dev right by my side!",
    ],
  },
  {
    name: "Jordan Wells",
    username: "jordan_w",
    avatar: "/avatars/avatar-6.jpg",
    text: [
      "Mentor AI feels like having a personal coding tutor 24/7. It helps me debug my code, improve my logic, and even teaches me new frameworks effortlessly.",
      "I’ve built two side projects in half the time because of how fast it helps me overcome roadblocks. Highly recommend it for any developer!",
    ],
  },
  {
    name: "Chris Bennett",
    username: "chrisbennett",
    avatar: "/avatars/avatar-5.jpg",
    text: [
      "I was skeptical about AI-powered mentors, but Mentor AI proved me wrong. It doesn’t just correct errors—it teaches and explains.",
    ],
  },
  {
    name: "Emma Diaz",
    username: "emma_d",
    avatar: "/avatars/avatar-4.jpg",
    text: [
      "Mentor AI isn’t just a tool—it’s like having a senior developer guiding you through every step of your journey.",
    ],
  },
  {
    name: "Liam Brooks",
    username: "liam_brooks",
    avatar: "/avatars/avatar-2.jpeg",
    text: [
      "It's like having a coding coach available 24/7. It helps me debug, optimize, and learn new concepts effortlessly.",
    ],
  },
];

const TestimonialCard = ({
  name,
  username,
  avatar,
  text,
}: {
  name: string;
  username: string;
  avatar: string;
  text: string[];
}) => (
  <div className="relative text-left transition-transform cursor-pointer scale-100 hover:scale-[102%] duration-300">
    <div className="bg-muted transition-all border rounded-lg shadow-sm p-4">
      <div className="flex items-center mb-2">
        <img
          alt={`${name}'s avatar`}
          loading="lazy"
          width="48"
          height="48"
          className="size-12 mr-3 rounded-full"
          src={avatar}
        />
        <div>
          <p className="font-bold text-[15px] text-foreground">{name}</p>
          <p className="text-[15px] text-muted-foreground">@{username}</p>
        </div>
      </div>
      <div className="text-[15px] text-muted-foreground mt-2">
        {text.map((line, index) => (
          <div key={index} className="mt-4">
            {line}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export function Testimonials() {
  return (
    <div className="max-w-6xl mx-auto my-12" id="testimonials">
      <div className="flex flex-col items-center gap-8 mb-6">
        <p className="uppercase text-primary">Customer Love</p>
        <h2 className="sm:text-5xl text-4xl font-serif text-balance font-medium text-center">
          Join other empwowered developers
        </h2>
        <p className="sm:text-xl text-lg text-center max-w-3xl">
          Mentor has helped developers understand over 100+ codebases. From
          open-source, organisations, to university students
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 sm:p-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
}
