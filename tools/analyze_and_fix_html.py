import os
import re
from bs4 import BeautifulSoup

# Directory containing HTML files
HTML_DIR = "../"
REPORT_FILE = "html_analysis_report.txt"

def analyze_html(file_path):
    """Analyze a single HTML file for structural and responsive issues."""
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    issues = []

    # Check for <meta name="viewport">
    if not soup.find('meta', attrs={'name': 'viewport'}):
        issues.append("Missing <meta name='viewport'>")

    # Check for <img> tags without alt attributes
    for img in soup.find_all('img'):
        if not img.get('alt'):
            issues.append(f"Image without alt attribute: {img}")

    # Check for empty <a> tags or broken hrefs
    for a in soup.find_all('a'):
        href = a.get('href')
        if not href or href.strip() == "#":
            issues.append(f"Anchor with invalid href: {a}")

    return issues

def generate_report():
    """Analyze all HTML files and generate a report."""
    report = []

    for file_name in os.listdir(HTML_DIR):
        if file_name.endswith('.html'):
            file_path = os.path.join(HTML_DIR, file_name)
            issues = analyze_html(file_path)

            if issues:
                report.append(f"File: {file_name}")
                report.extend([f"  - {issue}" for issue in issues])
                report.append("")

    # Save the report to a file
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write("\n".join(report))

    print(f"Analysis complete. Report saved to: {REPORT_FILE}")

if __name__ == "__main__":
    generate_report()