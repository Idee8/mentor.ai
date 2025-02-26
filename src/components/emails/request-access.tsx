import * as React from "react";

export const RequestAccessEmailTemplate: React.FC = ({}) => (
  <div>
    <h1>Hello,</h1>
    <p>
      Thanks for signing up for Mentor AI! 🚀 You're now on the waitlist, and
      we’ll invite you as soon as a slot opens up.
    </p>
    <p>
      Here's what you'll get access to:{" "}
      <ul>
        <li>Chat to your codebase</li>
        <li>Generate documentation</li>
        <li>Understand codebases</li>
        <li>Get useful insights from Mentor</li>
      </ul>
    </p>
    <p>We’ll notify you once your spot is ready. Stay tuned!</p>
    <hr />
    <p>The Mentor AI Team</p>
  </div>
);
