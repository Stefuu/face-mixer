import { NextResponse } from "next/server";

export function createErrorResponse(
  message: string,
  statusCode: number
): NextResponse {
  const errorResponse = {
    status: statusCode >= 500 ? "error" : "fail",
    message,
  };

  return new NextResponse(JSON.stringify(errorResponse), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}

export function validUrl(str: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(str);
}

export const funnyLoadingMessages = [
  "Why did the computer go to therapy? It had too many bytes of emotional baggage.",
  "I'm not slow; I'm just embracing the rhythm of life!",
  "Why don't scientists trust atoms? Because they make up everything!",
  "I'm calculating your response with the precision of a sloth's morning stretch.",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "I'm working diligently, like a hamster on a wheel... going nowhere fast!",
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "Hold on, I'm searching the vast depths of the digital universe for the perfect answer",
  "I'm like a fine wine - I get better with time... or so I'd like to think!",
  "Why did the math book look sad? Because it had too many problems.",
  "I'm not slow; I'm just savoring the suspense!",
  "What do you get when you cross a snowman and a vampire? Frostbite!",
  "I'm working as hard as a one-armed bricklayer in Baghdad.",
  "Why don't skeletons fight each other? They don't have the guts!",
  "I'm not a procrastinator; I'm just on a coffee break from productivity!",
  "Why did the bicycle fall over? Because it was two-tired!",
  "I'm trying to break the world record for the slowest chatbot response. Just a few more milliseconds",
  "What did one wall say to the other wall? 'I'll meet you at the corner!'",
  "I'm not slow; I'm just enjoying the scenic route to your answer!",
  "Why did the coffee file a police report? It got mugged!",
  "I'm like a tortoise in a marathon - slow and steady wins the chat!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "I'm not slow; I'm just practicing the ancient art of chat-fu!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "I'm working hard behind the scenes, like a ninja in the shadows!",
  "Why did the stadium get hot after the game? All of the fans left!",
  "I'm not slow; I'm just savoring the anticipation of your question!",
  "Why did the music teacher go to jail? Because she got caught with too many sharp objects!",
  "I'm like a well-crafted joke - it takes time to reach the punchline!",
  "Why did the bicycle fall over? Because it was two-tired!",
];
