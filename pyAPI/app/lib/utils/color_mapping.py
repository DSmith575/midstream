"""
Utility functions for consistent color coding across narrative text and summaries.
This helps create visual links between keywords and their related summaries.
"""

import re
from typing import Dict, List, Set, Tuple
from reportlab.lib import colors
from app.lib.constants.gptCompletions import CATEGORY_COLORS, CATEGORY_KEYWORDS


def detect_categories_in_text(text: str) -> Set[str]:
    """
    Detect which categories are mentioned in the text based on keywords.
    
    Args:
        text: The text to analyze
        
    Returns:
        Set of category names that were detected
    """
    if not text:
        return set()
    
    text_lower = text.lower()
    detected_categories = set()
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            # Use word boundaries to avoid partial matches
            if re.search(r'\b' + re.escape(keyword.lower()) + r'\b', text_lower):
                detected_categories.add(category)
                break  # Found match for this category, move to next
    
    return detected_categories


def get_category_color(category: str) -> str:
    """
    Get the hex color for a given category.
    
    Args:
        category: Category name
        
    Returns:
        Hex color string
    """
    return CATEGORY_COLORS.get(category, '#64748b')  # Default to gray


def get_category_color_object(category: str):
    """
    Get a ReportLab Color object for a given category.
    
    Args:
        category: Category name
        
    Returns:
        ReportLab HexColor object
    """
    hex_color = get_category_color(category)
    return colors.HexColor(hex_color)


def highlight_keywords_in_text(text: str, categories: List[str]) -> str:
    """
    Add color highlighting to keywords in text based on their categories.
    Returns HTML-formatted text suitable for ReportLab Paragraph.
    
    Args:
        text: The text to highlight
        categories: List of categories to look for keywords in
        
    Returns:
        HTML-formatted text with color highlighting
    """
    if not text or not categories:
        return text
    
    # Build a mapping of keyword to color
    keyword_to_color = {}
    for category in categories:
        if category in CATEGORY_KEYWORDS:
            color = get_category_color(category)
            for keyword in CATEGORY_KEYWORDS[category]:
                keyword_to_color[keyword.lower()] = color
    
    # Sort keywords by length (longest first) to avoid partial replacements
    sorted_keywords = sorted(keyword_to_color.keys(), key=len, reverse=True)
    
    # Track which parts of text have already been highlighted
    highlighted_text = text
    
    for keyword in sorted_keywords:
        color = keyword_to_color[keyword]
        # Use case-insensitive replacement with word boundaries
        pattern = re.compile(r'\b(' + re.escape(keyword) + r')\b', re.IGNORECASE)
        highlighted_text = pattern.sub(
            rf'<font color="{color}"><b>\1</b></font>',
            highlighted_text
        )
    
    return highlighted_text


def create_category_legend(categories: List[str]) -> Dict[str, str]:
    """
    Create a legend mapping category names to their colors.
    
    Args:
        categories: List of category names
        
    Returns:
        Dictionary mapping category names to hex colors
    """
    return {category: get_category_color(category) for category in categories}


def get_primary_category(text: str) -> str:
    """
    Determine the primary/most relevant category for a piece of text.
    Based on keyword frequency.
    
    Args:
        text: The text to analyze
        
    Returns:
        Primary category name or empty string if none found
    """
    if not text:
        return ''
    
    text_lower = text.lower()
    category_scores = {}
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            # Count occurrences using word boundaries
            matches = re.findall(r'\b' + re.escape(keyword.lower()) + r'\b', text_lower)
            score += len(matches)
        
        if score > 0:
            category_scores[category] = score
    
    if not category_scores:
        return ''
    
    # Return category with highest score
    return max(category_scores, key=category_scores.get)
