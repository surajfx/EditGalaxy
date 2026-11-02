/**
 * home-defaults.js
 * Built-in Home page content (2 cards + social links). Used when the admin
 * has not created any cards yet. Keep in sync with DEFAULT_HOME in index.html.
 */
const DEFAULT_HOME={
 title:"Create. Edit. Explore.",
 sub:"Free CapCut templates and ready-to-copy AI image prompts for Reels, Shorts and photos.",
 author:"surajfx",showStats:true,
 footDesc:"Free CapCut templates and ready-to-copy AI image prompts for creators.",
 social:[
  {id:"instagram",label:"Follow on Instagram",platform:"instagram",url:"https://www.instagram.com/trending_edit_day/",on:true,home:true,card:true,foot:true,primary:true},
  {id:"telegram",label:"Join on Telegram",platform:"telegram",url:"https://t.me/trending_edit_day",on:true,home:true,card:true,foot:true},
  {id:"whatsapp",label:"Join on WhatsApp",platform:"whatsapp",url:"https://whatsapp.com/channel/0029Vb8LDSC7z4kcrtFkae2k",on:true,home:true,card:true,foot:true},
  {id:"youtube",label:"YouTube",platform:"youtube",url:"https://youtube.com/@surajfx2.0",on:true,home:false,card:false,foot:true},
  {id:"tiktok",label:"TikTok",platform:"tiktok",url:"https://www.tiktok.com/@trending_edit_day",on:true,home:false,card:false,foot:true},
  {id:"facebook",label:"Facebook",platform:"facebook",url:"https://www.facebook.com/profile.php?id=61565474049934",on:true,home:false,card:false,foot:true},
  {id:"threads",label:"Threads",platform:"threads",url:"https://www.threads.com/@trending_edit_day",on:true,home:false,card:false,foot:true}
 ],
 cards:[
  {id:"all-templates",slug:"all-templates",order:1,on:true,title:"All CapCut Templates",titleOn:true,
   short:"Browse free CapCut templates for Reels, Shorts and photo videos — open one, add your clips and export.",shortOn:true,
   cover:"",coverOn:true,bylineOn:true,socialOn:true,homeChips:true,
   boxes:[
    {heading:"Free CapCut templates, ready to use",text:"EditGalaxy collects CapCut templates for Instagram Reels, YouTube Shorts and photo videos. Every template opens inside CapCut in one tap, so all you do is add your own photos or short clips and export the finished video.",on:true},
    {heading:"How to use a template",text:"Pick a template you like, tap Use Template on CapCut, choose your photos or clips in the order you want, preview the edit and export it. Most templates take only a couple of minutes.",on:true},
    {heading:"Tips for a better result",text:"Use clear, well-lit photos, keep your clips in the same orientation as the template, and match the length of your clips to the beat when the template is music-driven. Preview the whole edit before exporting.",on:true},
    {heading:"",text:"",on:false},{heading:"",text:"",on:false}],
   imgs:[],link:{type:"templates"},chipsT:"all,trending,cinematic,hindi,english,funk,ai prompt",chipsP:"",startFilter:"all",custom:[]},
  {id:"ai-prompts",slug:"ai-image-prompts",order:2,on:true,title:"AI Image Prompts",titleOn:true,
   short:"Copy ready-made AI image prompts — portraits, cinematic looks, anime, fantasy and more.",shortOn:true,
   cover:"",coverOn:true,bylineOn:true,socialOn:true,homeChips:true,
   boxes:[
    {heading:"Ready-to-copy AI image prompts",text:"Each prompt on EditGalaxy is written to work with popular AI image tools such as ChatGPT, Gemini and Leonardo AI. Choose a prompt, copy it, upload your own photo if the prompt asks for one and generate your image.",on:true},
    {heading:"How to use a prompt",text:"Open a prompt, tap Get Prompt, pick the girl or boy version, copy the text and paste it into your AI tool. If the first result is not perfect, generate again or change a few words such as colours, outfit or background.",on:true},
    {heading:"Tips for better images",text:"Use a high-resolution reference photo, keep faces clearly visible, and try the same prompt in more than one AI tool because each one renders styles differently.",on:true},
    {heading:"",text:"",on:false},{heading:"",text:"",on:false}],
   imgs:[],link:{type:"prompts"},chipsT:"",chipsP:"all,trending,cinematic,4k,anime,portrait,fantasy,static",startFilter:"all",custom:[]}
 ]
};

module.exports = { DEFAULT_HOME };
