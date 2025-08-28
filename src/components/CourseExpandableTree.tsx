import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import courseDetailsData from '../data/courseDetails.json';

interface CourseTreeProps {
  courseKey: string;
  isNight: boolean;
}

interface TopicItem {
  title: string;
  items?: string[];
}

interface Topic {
  title: string;
  description: string;
  subtopics: TopicItem[];
}

const CourseExpandableTree: React.FC<CourseTreeProps> = ({ courseKey, isNight }) => {
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const { i18n } = useTranslation();

  // Helper function to get localized text
  const getLocalizedText = (text: string): string => {
    const isEnglish = i18n.language === 'en';
    const parts = text.split('|');
    return isEnglish ? parts[0] : (parts[1] || parts[0]);
  };

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const courseData = courseDetailsData[courseKey as keyof typeof courseDetailsData];
  
  if (!courseData) {
    return null;
  }

  const renderExpandableTree = (topics: Topic[]) => {
    return topics.map((topic, index) => {
      const topicKey = `${courseKey}-${index}`;
      const isExpanded = expandedItems[topicKey];
      
      return (
        <div key={topicKey} style={{ marginBottom: 8 }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '4px 0',
              fontSize: 16,
              fontWeight: 600
            }}
            onClick={() => toggleExpand(topicKey)}
          >
            <span style={{ 
              marginRight: 8, 
              fontSize: 14, 
              fontWeight: 'bold',
              color: isNight ? '#51ff8b' : '#1976d2',
              minWidth: '14px',
              textAlign: 'center'
            }}>
              {isExpanded ? '−' : '+'}
            </span>
            <span style={{ color: isNight ? '#ffe259' : '#232946' }}>
              {getLocalizedText(topic.title)}
            </span>
          </div>
          
          {isExpanded && topic.subtopics && (
            <div style={{ marginLeft: 24, marginTop: 8 }}>
              {topic.subtopics.map((subtopic: TopicItem, subIndex: number) => {
                const subtopicKey = `${topicKey}-${subIndex}`;
                const isSubExpanded = expandedItems[subtopicKey];
                
                return (
                  <div key={subtopicKey} style={{ marginBottom: 6 }}>
                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        padding: '2px 0',
                        fontSize: 14
                      }}
                      onClick={() => toggleExpand(subtopicKey)}
                    >
                      <span style={{ 
                        marginRight: 8, 
                        fontSize: 12, 
                        fontWeight: 'bold',
                        color: isNight ? '#51ff8b' : '#1976d2',
                        minWidth: '12px',
                        textAlign: 'center'
                      }}>
                        {isSubExpanded ? '−' : '+'}
                      </span>
                      <span style={{ 
                        fontWeight: 500,
                        color: isNight ? '#fff' : '#444' 
                      }}>
                        {getLocalizedText(subtopic.title)}
                      </span>
                    </div>
                    
                    {isSubExpanded && subtopic.items && (
                      <div style={{ marginLeft: 20, marginTop: 4 }}>
                        {subtopic.items.map((item: string, itemIndex: number) => (
                          <div 
                            key={itemIndex} 
                            style={{ 
                              padding: '2px 0',
                              fontSize: 13,
                              color: isNight ? '#ccc' : '#666',
                              marginLeft: 16
                            }}
                          >
                            • {getLocalizedText(item)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ fontSize: 16, marginLeft: 8 }}>
      {renderExpandableTree(courseData)}
    </div>
  );
};

export default CourseExpandableTree;
