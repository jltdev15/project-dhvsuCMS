<template>
  <section class="new-prescription">
    <h2>New Prescription</h2>
    <div class="form-card">
      <div class="form-title">Add New Prescription</div>
      <form>
        <div class="row">
          <div class="field-group">
            <label>Select Patient</label>
            <select><option>Select Patient</option></select>
          </div>
          <div class="field-group">
            <label>Visit Date</label>
            <input type="date" />
          </div>
          <div class="field-group">
            <label>Next Visit Date</label>
            <input type="date" />
          </div>
        </div>
        <div class="row">
          <div class="field-group">
            <label>BP</label>
            <input type="text" />
          </div>
          <div class="field-group">
            <label>Weight</label>
            <input type="text" />
          </div>
          <div class="field-group">
            <label>Disease</label>
            <input type="text" />
          </div>
        </div>
        <div class="row">
          <div class="field-group">
            <label>Select Medicine</label>
            <select><option>Select Medicine</option></select>
          </div>
          <div class="field-group">
            <label>Select Packing</label>
            <select><option></option></select>
          </div>
          <div class="field-group">
            <label>Quantity</label>
            <input type="text" />
          </div>
          <div class="field-group">
            <label>Dosage</label>
            <input type="text" />
          </div>
          <div class="field-group add-btn-group">
            <button type="button" class="add-btn">+</button>
          </div>
        </div>
        <div class="table-section">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Medicine Name</th>
                <th>Packing</th>
                <th>QTY</th>
                <th>Dosage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <!-- Table rows go here -->
            </tbody>
          </table>
        </div>
        <div class="save-btn-row">
          <button type="submit" class="save-btn">Save</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
// No logic for now
</script>

<style scoped>
.new-prescription {
  padding: 32px;
}
.new-prescription h2 {
  color: #cfd8dc;
  margin-bottom: 18px;
}
.form-card {
  background: #232a2f;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 18px 24px 24px 24px;
}
.form-title {
  color: #cfd8dc;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 18px;
  border-bottom: 2px solid #3973a5;
  padding-bottom: 8px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.row {
  display: flex;
  gap: 18px;
  margin-bottom: 0;
}
.field-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 120px;
}
.field-group label {
  color: #cfd8dc;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
}
.field-group input,
.field-group select {
  background: #232a2f;
  border: 1px solid #6fa3d9;
  border-radius: 3px;
  color: #cfd8dc;
  padding: 7px 10px;
  font-size: 1rem;
  outline: none;
}
.add-btn-group {
  display: flex;
  align-items: flex-end;
  min-width: 50px;
}
.add-btn {
  background: #3973a5;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 1.5rem;
  width: 38px;
  height: 38px;
  cursor: pointer;
}
.table-section {
  margin-top: 18px;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: #232a2f;
}
thead th {
  background: #800000;
  color: #fff;
  font-weight: 600;
  padding: 8px 0;
}
tbody td {
  color: #cfd8dc;
  padding: 8px 0;
  text-align: center;
}
.save-btn-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}
.save-btn {
  background: #800000;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 1.1rem;
  padding: 10px 38px;
  cursor: pointer;
}
</style> 