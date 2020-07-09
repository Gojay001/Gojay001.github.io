---
title: FSL-Survey-2019
thumbnail: /gallery/thumbnails/FSL-Survey-2019.png
date: 2020-07-07 15:23:44
categories:
    - DeepLearning
    - Few-Shot Learning
    - FSL Survey
tags: [DL, FSL, Survey]
---

> **FSL-Survey**[[1]](https://arxiv.org/abs/1904.05046) is a **survey on Few-Shot Learning**(FSL), which cotains 166 paper to review Few-Shot Learning. They categorize FSL methods from three perspectives: `data`, `model` and `algorithm`. There are some details of reading it. 
<!-- more -->

# Contents
---
- **[Paper & note](#Paper&note)**
- **[Paper understanding](#Paper)**
- **[Note](#Note)**
- **[References](#References)**

# Paper & note
---
> **Paper**: [Generalizing from a Few Examples: A Survey on Few-Shot Learning](https://arxiv.org/abs/1904.05046)(CSUR 2019 paper)  
> **Note**: [Mendeley](https://www.mendeley.com/viewer/?fileId=327bb16e-b716-d631-7d51-1a80bda5efb4&documentId=7dee4617-ab8b-3b47-9f5c-4245a1693997)

# Paper
---
## Abstract
![FSL_Abstract.png](https://i.loli.net/2020/07/09/EAjulYM8wtJLoBH.png)
> 1. Starting from a `formal definition` of FSL, then point out that the `core issue` in FSL.  
> 2. **Data**: which uses prior knowledge to `augment the supervised experience`.  
> 3. **model**: which uses prior knowledge to `reduce the size of the hypothesis space`.  
> 4. **algorithm**: which uses prior knowledge to `alter the search for the best hypothesis` in the given hypothesis space.  
> 5. `Promising directions` are also proposed to provide insights for future research.

## Definition
![FSL_MLdefinition.png](https://i.loli.net/2020/07/09/QdI3gBFulmcSP1y.png)
![FSL_FSLdefinition.png](https://i.loli.net/2020/07/09/1iGFHbPKAJj3hUD.png)
![FSL_Minimization.png](https://i.loli.net/2020/07/09/bZu4cqMBxmQtLzE.png)
![FSL_Problem.png](https://i.loli.net/2020/07/09/XYrSviFTUd8bkIL.png)

## Taxonomy
![FSL_Taxonomy.png](https://i.loli.net/2020/07/09/WSLoZFvi98NRMaY.png)
![FSL_methods.png](https://i.loli.net/2020/07/09/HAF7cUVnYhPB1lE.png)

## Data
![FSL_data.png](https://i.loli.net/2020/07/09/tRFjy7m8vYWh4wa.png)
![FSL_DataAugmentation.png](https://i.loli.net/2020/07/09/PQmErDOdFsVNiK9.png)

## Model
![FSL_model.png](https://i.loli.net/2020/07/09/qIXFzS6BKVbZg9w.png)
### Multitask Learning
![FSL_ParameterTyping.png](https://i.loli.net/2020/07/09/hlbiYKeX2AQTRtG.png)
![FSL_ParameterSharing.png](https://i.loli.net/2020/07/09/CmYvdOSZJijrquI.png)
### Embedding Learning
![FSL_EmbeddingLearning.png](https://i.loli.net/2020/07/09/z29XpluoK1YHAJF.png)
![FSL_task-invariant.png](https://i.loli.net/2020/07/09/BNhpZciAQOnSDyK.png)
![FSL_hybrid.png](https://i.loli.net/2020/07/09/VwPC8pSNW5Oi4G3.png)
### Learning with External Memory
![FSL_memory.png](https://i.loli.net/2020/07/09/Niel1OZzVvyDaEf.png)
![FSL_MemoryMethods.png](https://i.loli.net/2020/07/09/X74PBbhluHUzidk.png)
### Generative Modeling
![FSL_generative.png](https://i.loli.net/2020/07/09/nPKWEXNlZAh7r4L.png)

## Algorithm
![FSL_algorithm.png](https://i.loli.net/2020/07/09/ef2QC6LGgTyVnAw.png)
### Refining Existing Parameters
![FSL_fine-tune.png](https://i.loli.net/2020/07/09/SOl4cJosVaBrbuP.png)
![FSL_aggregate.png](https://i.loli.net/2020/07/09/iE5CvtDh7eybcKA.png)
![FSL_NewParameters.png](https://i.loli.net/2020/07/09/qL1nZwDyuCHiX9t.png)
### Refining Meta-Learned Parameter
![FSL_Meta-Learned.png](https://i.loli.net/2020/07/09/urRwAjUkHgOXiDI.png)
### Learning the Optimizer
![FSL_optimizer.png](https://i.loli.net/2020/07/09/QRkw2VajdZxFtmG.png)

## Meta-learning
![FSL_meta-learning.png](https://i.loli.net/2020/07/09/C3IEkxsnytqduOP.png)

# Note
---
> Offical Online link can be found in **FewShotPapers**[[2]](https://github.com/tata1661/FewShotPapers).

# References
---
> [1] Wang Y, Yao Q, Kwok J T, et al. Generalizing from a few examples: A survey on few-shot learning[J]. ACM Computing Surveys (CSUR), 2019.  
> [2] FewShotPapers. https://github.com/tata1661/FewShotPapers
