"""Concatenate rulebook front/back single-page PDFs into one 2-page artwork PDF."""
import sys
from pypdf import PdfReader, PdfWriter


def main():
    if len(sys.argv) != 4:
        print("Usage: python concat_rulebook_pages.py <front.pdf> <back.pdf> <output.pdf>")
        sys.exit(1)

    front_path, back_path, output_path = sys.argv[1:4]
    writer = PdfWriter()

    for path in (front_path, back_path):
        reader = PdfReader(path)
        writer.add_page(reader.pages[0])

    with open(output_path, "wb") as f:
        writer.write(f)
    print(f"Concatenated rulebook pages -> {output_path}")


if __name__ == "__main__":
    main()
