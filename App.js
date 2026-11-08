import React, { useState } from 'react';
import { Alert, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './src/firebase';

const BRAND = 'Private Nursing Home Services';
const WHATSAPP = '923025259802';
const SERVICES = [
  'Home Nursing Care', 'Patient Attendant Services', 'IV Cannula Insertion',
  'Urinary Catheterization', 'NG Tube Care', 'PEG Tube Care',
  'Injection Services', 'Vital Signs Monitoring', 'Post-Operative Care',
  'Elderly Patient Care'
];

export default function App() {
  const [service, setService] = useState(SERVICES[0]);
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  async function submitBooking() {
    if (!patientName.trim() || !phone.trim() || !preferredDate.trim() || !preferredTime.trim() || !address.trim()) {
      Alert.alert('Required details', 'Please fill patient name, phone, date, time and address.');
      return;
    }
    setBusy(true);
    const booking = {
      patientName: patientName.trim(), phone: phone.trim(), service,
      preferredDate: preferredDate.trim(), preferredTime: preferredTime.trim(),
      address: address.trim(), notes: notes.trim(), status: 'New',
      createdAt: serverTimestamp()
    };
    let saved = false;
    try {
      await addDoc(collection(db, 'bookings'), booking);
      saved = true;
    } catch (e) {
      // WhatsApp fallback still allows the user to send the booking request.
    }
    const message = `${BRAND} — Booking Request\nPatient: ${booking.patientName}\nPhone: ${booking.phone}\nService: ${service}\nDate: ${booking.preferredDate}\nTime: ${booking.preferredTime}\nAddress: ${booking.address}\nNotes: ${booking.notes || 'N/A'}\nDatabase saved: ${saved ? 'Yes' : 'Not saved — please configure Firebase'}`;
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
    setBusy(false);
    try {
      await Linking.openURL(url);
      if (!saved) Alert.alert('WhatsApp opened', 'Booking was not saved to the admin database. Configure Firebase to enable Admin Panel records.');
    } catch {
      Alert.alert('Could not open WhatsApp', 'Please install WhatsApp or contact +92 302 5259802.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.logo}>✚</Text>
          <Text style={styles.title}>{BRAND}</Text>
          <Text style={styles.subtitle}>Professional Home Healthcare • Rawalpindi & Islamabad</Text>
        </View>
        <Text style={styles.section}>Book a Home Care Service</Text>
        <Text style={styles.label}>Select service</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceScroll}>
          {SERVICES.map(item => (
            <TouchableOpacity key={item} onPress={() => setService(item)} style={[styles.chip, service === item && styles.chipActive]}>
              <Text style={[styles.chipText, service === item && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Field label="Patient Name *" value={patientName} onChangeText={setPatientName} placeholder="Enter patient name" />
        <Field label="Contact Number *" value={phone} onChangeText={setPhone} placeholder="03XX XXXXXXX" keyboardType="phone-pad" />
        <Field label="Preferred Date *" value={preferredDate} onChangeText={setPreferredDate} placeholder="DD-MM-YYYY" />
        <Field label="Preferred Time *" value={preferredTime} onChangeText={setPreferredTime} placeholder="e.g. 4:00 PM" />
        <Field label="Full Address *" value={address} onChangeText={setAddress} placeholder="House, street, area, city" />
        <Field label="Additional Notes" value={notes} onChangeText={setNotes} placeholder="Patient needs / details (optional)" multiline />
        <TouchableOpacity style={styles.button} onPress={submitBooking} disabled={busy}>
          <Text style={styles.buttonText}>{busy ? 'Submitting…' : 'Submit Booking via WhatsApp'}</Text>
        </TouchableOpacity>
        <Text style={styles.foot}>WhatsApp: +92 302 5259802</Text>
        <Text style={styles.foot}>Instagram: @juttchzaman • zamanjutt07@gmail.com</Text>
        <Text style={styles.foot}>152B, B-Block, Satellite Town, Chandni Chowk, Rawalpindi</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, multiline, ...props }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} multiline={multiline} style={[styles.input, multiline && styles.multiline]} placeholderTextColor="#8A97A5" /></View>;
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#F3F8F7'},
  container:{padding:20,paddingBottom:36},
  hero:{backgroundColor:'#0B6B62',borderRadius:22,padding:22,marginBottom:24},
  logo:{fontSize:30,color:'#FFFFFF',fontWeight:'800'},
  title:{fontSize:24,fontWeight:'800',color:'#FFFFFF',marginTop:8},
  subtitle:{fontSize:13,color:'#D7F2ED',marginTop:7,lineHeight:19},
  section:{fontSize:20,fontWeight:'800',color:'#163B39',marginBottom:14},
  label:{fontSize:13,fontWeight:'700',color:'#355451',marginBottom:7},
  field:{marginBottom:14},
  input:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#D9E6E3',borderRadius:12,paddingHorizontal:14,paddingVertical:13,fontSize:15,color:'#183B38'},
  multiline:{height:90,textAlignVertical:'top'},
  serviceScroll:{marginBottom:18},
  chip:{paddingHorizontal:13,paddingVertical:10,borderRadius:18,backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#D9E6E3',marginRight:8,marginBottom:5},
  chipActive:{backgroundColor:'#0B6B62',borderColor:'#0B6B62'},
  chipText:{fontSize:12,color:'#355451',fontWeight:'600'},
  chipTextActive:{color:'#FFFFFF'},
  button:{backgroundColor:'#149477',padding:16,borderRadius:14,alignItems:'center',marginTop:5},
  buttonText:{color:'#FFFFFF',fontWeight:'800',fontSize:15},
  foot:{fontSize:11,color:'#637A77',textAlign:'center',marginTop:10,lineHeight:16}
});
