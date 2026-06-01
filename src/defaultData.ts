import { AnniversarySettings } from "./types";

export const DEFAULT_SETTINGS: AnniversarySettings = {
  coupleName1: "Andi",
  coupleName2: "Syafira",
  anniversaryDate: "2023-06-01", // Default dating date: 1st June 2023
  anniversaryType: "dating",
  greetingTitle: "Happy Anniversary, Sayang!",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // Romantic instrumental piano-like
  loveLetterText: "Hari ini adalah penanda dari waktu yang luar biasa ketika kamu masuk ke dalam hidupku dan mengubah segalanya menjadi lebih indah. Setiap tawa yang kita bagikan, setiap rintangan yang kita lewati bersama, dan setiap pelukan hangat darimu adalah harta karun tak ternilai bagiku.\n\nTerima kasih telah sabar mendampingiku, mencintaiku dengan tulus dalam segala keadaaan, dan terus menjadi alasan terbaikku untuk bangun di pagi hari dengan senyuman. Aku berjanji untuk terus mencintaimu, menjaga kepercayaanmu, dan berjalan beriringan bersamamu melewati setiap musim kehidupan.\n\nSelamat hari jadi yang indah kita, sayangku. Perjalanan kita masih panjang, dan aku tidak sabar untuk menulis esok hari bersamamu.",
  loveLetterSign: "Selamanya milikmu, Andi",
  futureWishesText: "Bersama kita merajut setiap impian, mengukir senyum di setiap duka, dan berjalan beriringan menuju masa depan yang penuh dengan tawa dan kebahagiaan. Semoga cinta kita senantiasa dikelilingi kedamaian, kesehatan, dan kehangatan yang tak pernah memudar.",
  memories: [
    {
      id: "mem-1",
      title: "Pertemuan Pertama",
      date: "2023-06-15",
      imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
      story: "Di sebuah kedai kopi sudut kota, waktu seolah berhenti saat mata kita pertama kali bertemu. Obrolan canggung berganti menjadi tawa renyah berjam-jam yang membuat kita berdua sadar bahwa ini adalah awal dari sesuatu yang sangat istimewa."
    },
    {
      id: "mem-2",
      title: "Senja di Tepi Pantai",
      date: "2023-09-08",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      story: "Saat deburan ombak menyentuh kaki dan langit berubah menjadi jingga keunguan, kita duduk berdampingan tanpa banyak bicara. Menyadari bahwa keheningan bersamamu terasa lebih nyaman daripada keramaian mana pun."
    },
    {
      id: "mem-3",
      title: "Menatap Langit Malam",
      date: "2023-12-31",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
      story: "Menyambut tahun baru di bawah gemerlap kembang api kota. Di tengah hiruk-pikuk suara klakson dan sorak penonton, bisikan harapanmu terdengar paling merdu di telingaku."
    },
    {
      id: "mem-4",
      title: "Makan Malam Romantis",
      date: "2024-02-14",
      imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80",
      story: "Merayakan hari kasih sayang dengan masakan sederhana yang kita buat berdua di dapur. Rasanya mungkin agak terlalu asin, tapi tawa dan kemeriahan malam itu menjadikannya hidangan bintang lima terbaik kita."
    },
    {
      id: "mem-5",
      title: "Petualangan Pertama",
      date: "2024-07-20",
      imageUrl: "https://images.unsplash.com/photo-1511185307590-3c29c11275ca?w=800&auto=format&fit=crop&q=80",
      story: "Perjalanan luar kota pertama kita menyusuri bukit hijau yang damai. Meskipun kaki kita lelah karena mendaki, senyum lebarmu saat mencapai puncak menghapus seluruh kelelahan seketika."
    },
    {
      id: "mem-6",
      title: "Hari Wisuda Bersama",
      date: "2024-11-12",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
      story: "Di hari pencapaian besar kita, kita berdiri berdampingan mengenakan toga kebanggaan. Tanpa dukunganmu yang tiada henti, perjuangan ini takkan terasa seindah dan seberarti ini."
    }
  ],
  wishes: [
    {
      id: "wish-1",
      sender: "Andi",
      message: "Semoga kita bisa terus saling menguatkan, saling melengkapi rasa bahagia, dan segera mewujudkan impian rumah kecil kita.",
      timestamp: "2026-06-01T08:00:00Z"
    },
    {
      id: "wish-2",
      sender: "Syafira",
      message: "Terima kasih sudah selalu sabar denganku. Semoga cinta kita awet terus sampai kakek nenek, ya!",
      timestamp: "2026-06-01T08:05:00.000Z"
    }
  ]
};
