namespace Matress_Website.Models
{
    public class Mattress
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Category { get; set; } = "";
        public string CategoryKey { get; set; } = "";
        public string Firmness { get; set; } = "";
        public int FirmnessLevel { get; set; }          // 1 (plush) - 10 (extra firm)
        public string Height { get; set; } = "";
        public List<string> Images { get; set; } = new();   // paths under wwwroot/Image/web/; first is the cover
        public string Image => Images.FirstOrDefault() ?? "";
        public string Tag { get; set; } = "";
        public string Summary { get; set; } = "";
        public List<string> Features { get; set; } = new();
        public string BestFor { get; set; } = "";

        public static readonly string[] Sizes =
        {
            "Single (90 x 190 cm)", "Double (120 x 200 cm)", "Queen (160 x 200 cm)",
            "King (180 x 200 cm)", "Super King (200 x 200 cm)", "Custom Size"
        };

        // Filter key + label for each mattress type, in display order.
        public static readonly (string Key, string Label)[] Categories =
        {
            ("medical", "Medical"), ("bonnell", "Bonnell Spring"), ("pocket", "Pocket Spring"),
            ("folding", "Folding Foam"), ("eurotop", "Euro Top"), ("pillowtop", "Pillow Top")
        };

        public static List<Mattress> Catalog() => new()
        {
            new Mattress
            {
                Id = "medical", Name = "Velora Medical Mattress", Category = "Medical", CategoryKey = "medical",
                Firmness = "Firm", FirmnessLevel = 9, Height = "26 cm", Tag = "Spine Care",
                Images = new() { "products/medical-1.jpg", "products/medical-2.jpg", "products/medical-3.jpg", "products/medical-4.jpg" },
                Summary = "Orthopedic-grade support with a soft knitted fabric cover. Keeps your spine aligned and eases back and joint strain.",
                Features = new() { "High-density orthopedic support core", "Premium knitted fabric cover", "Even, firm sleeping surface", "Helps relieve back & joint pressure" },
                BestFor = "Back pain, posture care and stomach sleepers"
            },
            new Mattress
            {
                Id = "bonnell-spring", Name = "Velora Bonnell Spring Mattress", Category = "Bonnell Spring", CategoryKey = "bonnell",
                Firmness = "Medium-Firm", FirmnessLevel = 7, Height = "24 cm", Tag = "Great Value",
                Images = new() { "products/bonnell-1.jpg" },
                Summary = "A durable, time-tested interconnected Bonnell spring unit with a quilted comfort top. Everyday comfort at a smart price.",
                Features = new() { "Interconnected Bonnell spring unit", "Quilted foam comfort layer", "Strong, durable construction", "Ideal for homes, guest rooms & rentals" },
                BestFor = "Everyday use, guest rooms and apartments"
            },
            new Mattress
            {
                Id = "pocket-spring", Name = "Velora Pocket Spring Mattress", Category = "Pocket Spring", CategoryKey = "pocket",
                Firmness = "Medium-Firm", FirmnessLevel = 7, Height = "28 cm", Tag = "Best Seller",
                Images = new() { "products/pocket-1.jpg", "products/pocket-2.jpg" },
                Summary = "Individually pocketed springs that move with your body. Excellent support and zero partner disturbance.",
                Features = new() { "Individually wrapped pocket coils", "Minimal motion transfer", "Reinforced edge support", "Breathable quilted cover" },
                BestFor = "Couples and back sleepers"
            },
            new Mattress
            {
                Id = "folding-foam", Name = "Velora Folding Foam Mattress", Category = "Folding Foam", CategoryKey = "folding",
                Firmness = "Medium", FirmnessLevel = 6, Height = "10 cm", Tag = "Space Saver",
                Images = new() { "products/folding-1.jpg" },
                Summary = "A lightweight foam mattress that folds away in seconds. Perfect for guests, travel, floor beds and small spaces.",
                Features = new() { "Folds for easy storage", "Lightweight & portable", "Supportive high-quality foam", "Removable, washable cover" },
                BestFor = "Guests, kids' rooms and compact living"
            },
            new Mattress
            {
                Id = "euro-top", Name = "Velora Euro Top Mattress", Category = "Euro Top", CategoryKey = "eurotop",
                Firmness = "Medium", FirmnessLevel = 6, Height = "30 cm", Tag = "Hotel Luxury",
                Images = new() { "products/eurotop-1.jpg", "products/eurotop-2.jpg", "products/eurotop-3.jpg", "products/layers.jpg" },
                Summary = "A flush, sewn-in Euro top layer over a supportive core for that crisp five-star hotel feel.",
                Features = new() { "Integrated Euro top comfort layer", "Multi-layer foam construction", "Stylish knitted fabric with piped edges", "Balanced comfort & support" },
                BestFor = "Anyone who loves a hotel-style bed"
            },
            new Mattress
            {
                Id = "pillow-top", Name = "Velora Pillow Top Mattress", Category = "Pillow Top", CategoryKey = "pillowtop",
                Firmness = "Plush", FirmnessLevel = 3, Height = "32 cm", Tag = "Most Loved",
                Images = new() { "products/pillowtop-1.jpg", "products/fabric.jpg" },
                Summary = "Our most indulgent mattress: a soft, cushioned pillow top over a supportive base for cloud-like comfort.",
                Features = new() { "Plush pillow-top cushioning", "Luxurious damask quilted fabric", "Pressure relief at shoulders & hips", "Supportive base layer" },
                BestFor = "Side sleepers and those who love a soft feel"
            }
        };
    }
}
