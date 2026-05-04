# Integrated Usability Metrics — Scheduling System  
_ISO/IEC/IEEE 15939:2017_

---

## M-01 — Task Success Rate

|Field|Description|
|---|---|
|**Evaluated construct**|Functional effectiveness + prevention|
|**Related requirements**|FR-01 to FR-06, RNF-US-01, RNF-US-05, RNF-US-07|
|**Information need**|Can the user complete tasks correctly without critical errors?|
|**Measured entity**|Complete task|
|**Measure type**|Derived|
|**Measurement method**|Record whether the task is completed correctly (no conflicts, invalid data, or failures).|
|**Formula**|`M-01 = (Successful tasks / Total tasks) × 100`|
|**Unit**|%|
|**Acceptance threshold**|≥ 90%|

### Integrated indicators

#### I-01.1 — Errors per task
- Formula: `Errors / tasks`

|Category|Technical users|Target users|
|---|---|---|
|Optimal|0 – 0.5|0 – 1|
|Acceptable|0.5 – 1|1 – 2|
|Deficient|> 1|> 2|

---

#### I-01.2 — Invalid action attempts (prevented)
- Method: count of blocked attempts

|Category|Technical users|Target users|
|---|---|---|
|Optimal|0 – 1|0 – 2|
|Acceptable|2|2 – 3|
|Deficient|> 2|> 3|

---

#### I-01.3 — Correct confirmations
- Formula: `Confirmed actions without cancellation / total confirmations × 100`

|Category|Technical users|Target users|
|---|---|---|
|Optimal|≥ 95%|≥ 90%|
|Acceptable|90 – 95%|80 – 90%|
|Deficient|< 90%|< 80%|

---

## M-02 — Task Completion Time

|Field|Description|
|---|---|
|**Evaluated construct**|Efficiency|
|**Related requirements**|FR-01 to FR-07, RNF-US-03, RNF-US-06|
|**Information need**|Do users complete tasks within a reasonable time?|
|**Measured entity**|Task|
|**Measure type**|Base|
|**Formula**|`M-02 = average(Time per task)`|
|**Unit**|Seconds|

### Integrated indicators

#### I-02.1 — Time per task

|Category|Technical users|Target users|
|---|---|---|
|Optimal|≤ 60 s|≤ 120 s|
|Acceptable|60 – 90 s|120 – 180 s|
|Deficient|> 90 s|> 180 s|

---

#### I-02.2 — Number of steps
- Method: count of actions

|Category|Technical users|Target users|
|---|---|---|
|Optimal|≤ 8|≤ 10|
|Acceptable|8 – 12|10 – 15|
|Deficient|> 12|> 15|

---

#### I-02.3 — Backtracking in workflow

|Category|Technical users|Target users|
|---|---|---|
|Optimal|0 – 1|0 – 2|
|Acceptable|2 – 3|2 – 4|
|Deficient|> 3|> 4|

---

## M-03 — User Error Rate

|Field|Description|
|---|---|
|**Evaluated construct**|Prevention and clarity|
|**Related requirements**|RNF-US-01, RNF-US-04, RNF-US-07|
|**Formula**|`M-03 = (Errors / actions) × 100`|
|**Unit**|%|
|**Acceptance threshold**|≤ 5%|

### Integrated indicators

#### I-03.1 — Error types
- Method: simple classification

|Type|Interpretation|
|---|---|
|Invalid selection|Visibility issue|
|Scheduling conflict|Validation failure|
|Incorrect data|Input usability issue|

---

#### I-03.2 — Error recovery rate
- Formula: `Recovered errors / total errors × 100`

|Category|Technical users|Target users|
|---|---|---|
|Optimal|≥ 95%|≥ 85%|
|Acceptable|85 – 95%|70 – 85%|
|Deficient|< 85%|< 70%|

---

#### I-03.3 — Error messages shown

|Category|Technical users|Target users|
|---|---|---|
|Optimal|0 – 1|0 – 2|
|Acceptable|1 – 3|2 – 4|
|Deficient|> 3|> 4|

---

## M-04 — Error Recovery Time

|Field|Description|
|---|---|
|**Evaluated construct**|Recoverability|
|**Related requirements**|RNF-US-02, RNF-US-03, RNF-US-04|
|**Formula**|`M-04 = average(Error correction time)`|
|**Unit**|Seconds|
|**Acceptance threshold**|≤ 30 s|

### Integrated indicators

#### I-04.1 — Correction time

|Category|Technical users|Target users|
|---|---|---|
|Optimal|≤ 15 s|≤ 30 s|
|Acceptable|15 – 30 s|30 – 60 s|
|Deficient|> 30 s|> 60 s|

---

#### I-04.2 — Correction attempts

|Category|Technical users|Target users|
|---|---|---|
|Optimal|1|1 – 2|
|Acceptable|2|2 – 3|
|Deficient|> 2|> 3|

---

#### I-04.3 — Undo usage
- Formula: `Undo used in critical errors / critical errors × 100`

|Category|Technical users|Target users|
|---|---|---|
|Optimal|≥ 70%|≥ 50%|
|Acceptable|50 – 70%|30 – 50%|
|Deficient|< 50%|< 30%|

---

## M-05 — User Autonomy Rate

|Field|Description|
|---|---|
|**Evaluated construct**|Autonomy|
|**Related requirements**|RNF-US-04, RNF-US-06, FR-07 to FR-10|
|**Formula**|`M-05 = (Tasks completed without assistance / total tasks) × 100`|
|**Unit**|%|
|**Acceptance threshold**|≥ 85%|

### Integrated indicators

#### I-05.1 — Number of user questions

|Category|Technical users|Target users|
|---|---|---|
|Optimal|0 – 1|0 – 2|
|Acceptable|2 – 3|2 – 4|
|Deficient|> 3|> 4|

---

#### I-05.2 — Evaluator interventions

|Category|Technical users|Target users|
|---|---|---|
|Optimal|0|0 – 1|
|Acceptable|1|1 – 2|
|Deficient|> 1|> 2|

---

#### I-05.3 — Use of search/query features
- Method: count of effective usage

|Category|Technical users|Target users|
|---|---|---|
|Optimal|1 – 3|1 – 4|
|Acceptable|3 – 5|4 – 6|
|Deficient|> 5 or 0 without success|> 6 or without success|

---

## Global Evaluation Criteria

- **High performance:** metrics meet thresholds + most indicators in Optimal  
- **Acceptable:** metrics met, mixed indicator levels  
- **Deficient:** ≥ 2 metrics below threshold or multiple indicators in Deficient  
