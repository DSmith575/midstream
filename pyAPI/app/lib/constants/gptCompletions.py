GPT_COMPLETION_SECTIONS = {
    'Background, Present Living Situation, Significant Events, and Contingency Plan': [
        'A short narrative of the person\'s background', 'Current living situation etc',
    ],
    'Communication': [
        'Ability to express core needs Verbal or Non-Verbal', 'Can read/write?',
        'Can use a phone?',
        'Receptive / Expressive skills?'
    ],
    'Sensory and Speech difficulties': [
        'Blind or nearly blind', 'Deaf or nearly deaf', 'Hearing impaired', 'Speech impaired', 'Vision impaired',
    ],
    'Mobility': [
        'Driving', 'Falling or history of falling', 'Getting up after falling', 'Moving around in the community', 'Moving around inside home',
        'Moving Around Outside home', 'Transfers, wheelchair to car or bed to chair', 'Two or one assistance for all transfers',
        'Using arms, hands, or fingers', 'Using transport as a passenger', 'Wheelchair user',
    ],
    'Household Management': [
        'Faecal smearing', 'Administering personal finances', 'Garden / lawns',
        'Home safety', 'Laundry', 'Operating home heating appliances',
        'Meal preparation', 'Shopping for necessary items', 'Other housework'
    ],
    'Self-care': [
        'Bathing, showering, Washing self', 'Bed mobility', 'Dressing and / or undressing',
        'Eating and drinking', 'Faecal smearing', 'Grooming and caring for body parts',
        'Managing / preventing health problems', 'Managing medication',
        'Menstrual management', 'Night Care', 'Night settling', 'Toileting'
    ],
    'Continence': [
        'Faecal continence', 'Urinary continence',
    ],
    'Behaviour': [
        'Harm to others, Mood and emotion (anxiety, depression, unstable mood. etc)', 'Motivation',
        'Property damage', 'Repetitive', 'Routine', 'Self-harming',
        'Sleep and night behaviour (insomnia, excessive sleep, etc)', 'Socially inappropriate,',
        'Unsafe wandering', 'Withdrawn'
    ],
    'Memory / Cognition': [
        'Attention', 'Intellectual ability',
        'Memory', 'Orientation', 'Learning ability / Problem solving',
    ],
    'Supervision': [
        'Daily prompts', 'Needs 24-hour supervision', 'Some, for safety',
    ],
    'Recreational and Social': [
        'Community participation', 'Educational support', 'Specialist Teachers',
        'Family life', ' Socialization', 'Vocational support',
    ],
}

# Category-to-color mapping for consistent visual linking
CATEGORY_COLORS = {
    'Background, Present Living Situation, Significant Events, and Contingency Plan': '#0f766e',  # Teal
    'Communication': '#1d4ed8',  # Blue
    'Sensory and Speech difficulties': '#7c3aed',  # Purple
    'Mobility': '#be123c',  # Rose/Red
    'Household Management': '#b45309',  # Orange
    'Self-care': '#15803d',  # Green
    'Continence': '#0891b2',  # Cyan
    'Behaviour': '#dc2626',  # Red
    'Memory / Cognition': '#7c2d12',  # Brown
    'Supervision': '#4f46e5',  # Indigo
    'Recreational and Social': '#059669',  # Emerald
}

# Keywords associated with each category for highlighting
CATEGORY_KEYWORDS = {
    'Background, Present Living Situation, Significant Events, and Contingency Plan': [
        'background', 'living situation', 'contingency', 'history', 'event', 'family'
    ],
    'Communication': [
        'communication', 'verbal', 'non-verbal', 'express', 'speech', 'language', 
        'read', 'write', 'phone', 'receptive', 'expressive'
    ],
    'Sensory and Speech difficulties': [
        'blind', 'deaf', 'vision', 'hearing', 'sensory', 'impaired', 'speech impaired'
    ],
    'Mobility': [
        'mobility', 'walking', 'wheelchair', 'falling', 'transfer', 'driving',
        'moving', 'arms', 'hands', 'fingers', 'transport', 'movement'
    ],
    'Household Management': [
        'household', 'cleaning', 'laundry', 'cooking', 'meal', 'shopping',
        'finances', 'garden', 'home safety', 'heating'
    ],
    'Self-care': [
        'bathing', 'showering', 'dressing', 'eating', 'drinking', 'grooming',
        'medication', 'toileting', 'hygiene', 'self-care', 'personal care'
    ],
    'Continence': [
        'continence', 'incontinence', 'faecal', 'urinary', 'bladder', 'bowel'
    ],
    'Behaviour': [
        'behaviour', 'behavior', 'mood', 'anxiety', 'depression', 'emotion',
        'aggression', 'self-harm', 'wandering', 'withdrawn', 'motivation', 'routine'
    ],
    'Memory / Cognition': [
        'memory', 'cognition', 'cognitive', 'attention', 'orientation',
        'learning', 'problem solving', 'intellectual', 'thinking', 'confused'
    ],
    'Supervision': [
        'supervision', 'support', 'prompts', '24-hour', 'monitoring', 'safety'
    ],
    'Recreational and Social': [
        'recreational', 'social', 'community', 'participation', 'education',
        'family life', 'socialization', 'vocational', 'activities', 'hobbies'
    ],
}
