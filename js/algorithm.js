/**
 * 宠物MBTI匹配算法
 * 基于曼哈顿距离的15维向量匹配
 */

// 维度映射：每个维度对应2道题目
const DIMENSION_MAP = {
  'S1': ['Q1', 'Q2'],
  'S2': ['Q3', 'Q4'],
  'S3': ['Q5', 'Q6'],
  'E1': ['Q7', 'Q8'],
  'E2': ['Q9', 'Q10'],
  'E3': ['Q11', 'Q12'],
  'A1': ['Q13', 'Q14'],
  'A2': ['Q15', 'Q16'],
  'A3': ['Q17', 'Q18'],
  'Ac1': ['Q19', 'Q20'],
  'Ac2': ['Q21', 'Q22'],
  'Ac3': ['Q23', 'Q24'],
  'So1': ['Q25', 'Q26'],
  'So2': ['Q27', 'Q28'],
  'So3': ['Q29', 'Q30']
};

// 维度顺序（用于构建向量）
const DIMENSION_ORDER = ['S1', 'S2', 'S3', 'E1', 'E2', 'E3', 'A1', 'A2', 'A3', 'Ac1', 'Ac2', 'Ac3', 'So1', 'So2', 'So3'];

// 分数转等级映射
function scoreToLevel(score) {
  if (score >= 2 && score <= 4) return 'L'; // 低分
  if (score >= 5 && score <= 7) return 'M'; // 中分
  if (score >= 8 && score <= 10) return 'H'; // 高分
  return 'M'; // 默认中分
}

// 等级转数值
function levelToValue(level) {
  const map = { 'L': 1, 'M': 2, 'H': 3 };
  return map[level] || 2;
}

// 模式串转数值数组
function codeToVector(code) {
  return code.split('-').map(part => {
    return part.split('').map(char => levelToValue(char));
  }).flat();
}

/**
 * 计算用户答案向量
 * @param {Object} answers - 用户答案 {Q1: score, Q2: score, ...}
 * @returns {Array} 15维向量 [1-3, 1-3, ...]
 */
function calculateUserVector(answers) {
  const vector = [];
  
  for (const dimId of DIMENSION_ORDER) {
    const questions = DIMENSION_MAP[dimId];
    const totalScore = questions.reduce((sum, qId) => {
      return sum + (answers[qId] || 3); // 默认3分
    }, 0);
    
    const level = scoreToLevel(totalScore);
    vector.push(levelToValue(level));
  }
  
  return vector;
}

/**
 * 计算曼哈顿距离
 * @param {Array} userVector - 用户向量
 * @param {Array} typeVector - 人格类型向量
 * @returns {Number} 曼哈顿距离
 */
function calculateManhattanDistance(userVector, typeVector) {
  return userVector.reduce((sum, userVal, i) => {
    return sum + Math.abs(userVal - typeVector[i]);
  }, 0);
}

/**
 * 计算精确匹配维度数
 * @param {Array} userVector - 用户向量
 * @param {Array} typeVector - 人格类型向量
 * @returns {Number} 相同维度数量
 */
function calculateExactCount(userVector, typeVector) {
  return userVector.reduce((count, userVal, i) => {
    return count + (userVal === typeVector[i] ? 1 : 0);
  }, 0);
}

/**
 * 计算相似度
 * @param {Number} distance - 曼哈顿距离
 * @returns {Number} 相似度 (0-1)
 */
function calculateSimilarity(distance) {
  const maxDistance = 30; // 15维 * 2 = 最大可能距离
  return 1 - (distance / maxDistance);
}

/**
 * 匹配人格类型
 * @param {Object} answers - 用户答案
 * @param {Array} types - 人格类型数组
 * @param {Object} fallback - 兜底人格
 * @returns {Object} 匹配结果
 */
function matchPersonality(answers, types, fallback) {
  const userVector = calculateUserVector(answers);
  
  // 计算每种人格的匹配度
  const matches = types.map(type => {
    const typeVector = codeToVector(type.code);
    const distance = calculateManhattanDistance(userVector, typeVector);
    const exactCount = calculateExactCount(userVector, typeVector);
    const similarity = calculateSimilarity(distance);
    
    return {
      type: type,
      distance: distance,
      exactCount: exactCount,
      similarity: similarity,
      userVector: userVector,
      typeVector: typeVector
    };
  });
  
  // 排序：距离升序 -> 精确匹配数降序 -> 相似度降序
  matches.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    if (a.exactCount !== b.exactCount) {
      return b.exactCount - a.exactCount;
    }
    return b.similarity - a.similarity;
  });
  
  // 获取最佳匹配
  const bestMatch = matches[0];
  
  // 兜底机制：相似度 < 60% 时返回兜底人格
  if (bestMatch.similarity < 0.6) {
    return {
      type: fallback,
      distance: -1,
      exactCount: -1,
      similarity: bestMatch.similarity,
      userVector: userVector,
      typeVector: null,
      isFallback: true,
      allMatches: matches.slice(0, 5) // 前5个匹配结果
    };
  }
  
  return {
    ...bestMatch,
    isFallback: false,
    allMatches: matches.slice(0, 5) // 前5个匹配结果
  };
}

/**
 * 检查彩蛋触发条件（预留接口）
 * @param {Object} answers - 用户答案
 * @param {Array} easterEggs - 彩蛋配置
 * @returns {Object|null} 触发的彩蛋或null
 */
function checkEasterEggs(answers, easterEggs) {
  // 彩蛋机制预留实现
  // 可以根据特定题目组合触发隐藏人格
  return null;
}

/**
 * 生成结果URL参数
 * @param {Object} result - 匹配结果
 * @returns {String} URL参数字符串
 */
function generateResultParams(result) {
  const params = new URLSearchParams();
  params.set('type', result.type.id);
  params.set('sim', Math.round(result.similarity * 100));
  return params.toString();
}

/**
 * 从URL参数解析结果
 * @param {String} urlParams - URL参数字符串
 * @param {Array} types - 人格类型数组
 * @param {Object} fallback - 兜底人格
 * @returns {Object|null} 解析结果或null
 */
function parseResultParams(urlParams, types, fallback) {
  const params = new URLSearchParams(urlParams);
  const typeId = params.get('type');
  const similarity = parseInt(params.get('sim')) / 100;
  
  if (!typeId) return null;
  
  const type = types.find(t => t.id === typeId) || fallback;
  
  return {
    type: type,
    similarity: similarity,
    isShared: true
  };
}

// 导出函数（用于模块导入或全局使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateUserVector,
    calculateManhattanDistance,
    calculateSimilarity,
    matchPersonality,
    checkEasterEggs,
    generateResultParams,
    parseResultParams,
    DIMENSION_ORDER,
    DIMENSION_MAP
  };
}
